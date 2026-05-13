import React, { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider, CssBaseline, createTheme,
  AppBar, Toolbar, Box, Typography, Tabs, Tab,
  Chip, Button, IconButton, Tooltip, Paper,
  Checkbox, FormControlLabel, Dialog, DialogContent, DialogActions,
  Menu, MenuItem, Snackbar, Alert, CircularProgress, LinearProgress, Skeleton, Divider,
  TextField, InputAdornment, Popover, RadioGroup, FormControl, FormLabel, Radio as MuiRadio, FormControlLabel as MuiFormControlLabel, Select, InputLabel,
  useMediaQuery,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/TaskAlt';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlined2Icon from '@mui/icons-material/Settings';
import QuickreplyOutlinedIcon from '@mui/icons-material/QuickreplyOutlined';

// ── memoQ DS Color Tokens ─────────────────────────────────────────────────────
const orange   = { 500:'#F47623', 600:'#DD6210', 400:'#FC914A', 100:'#FFF1E8' };
const blue     = { 900:'#012A50', 800:'#014A8F', 700:'#0363BF', 600:'#097AE2',
                   500:'#178CF6', 400:'#47A4FB', 300:'#92CAFE', 200:'#C7E4FF',
                   100:'#E7F3FF', 50:'#F5FAFF' };
const blueGray = { 900:'#302D42', 800:'#3B3751', 700:'#4A4663', 600:'#615D7B',
                   500:'#86829D', 400:'#ACA9BD', 300:'#C7C5D4', 200:'#DAD8E4',
                   100:'#EDECF2', 50:'#FAFAFD' };
const green    = { 700:'#059054', 600:'#09AE67', 500:'#14C97B', 100:'#E4FBF1' };

// ── Sample text pool ──────────────────────────────────────────────────────────
const SAMPLE_POOL = [
  {
    source: 'The Department is committed to advancing meaningful stakeholder engagement throughout the implementation of the new federal framework. We will publish a stakeholder engagement plan and invite written submissions before the end of the second quarter. Departmental officials will host two virtual roundtables with representatives from civil society organizations, with simultaneous interpretation in both official languages.',
    speedDraft: 'A Minisztérium elkötelezett amellett, hogy előmozdítsa a jelentőségteljes érintetti részvételt az új szövetségi keretrendszer végrehajtása során. Közreadunk egy érintetti részvételi tervet, és írásbeli hozzászólásokat kérünk a második negyedév vége előtt. A minisztériumi tisztviselők két virtuális kerekasztal-beszélgetést szerveznek civil társadalmi szervezetek képviselőivel, mindkét hivatalos nyelven egyidejű tolmácsolással.',
    rag: 'A Minisztérium elkötelezett a szövetségi keretrendszer implementációja során megvalósuló érdemi stakeholder-bevonás előmozdítása mellett. Ezúton közzétesszük a társadalmi egyeztetési tervet, és várjuk az írásos észrevételeket a második negyedév lezárultáig. A tárca tisztviselői két virtuális kerekasztal-konferenciát rendeznek a civil szféra képviselői számára, biztosítva a mindkét hivatalos nyelven elérhető szinkrontolmácsolást.',
  },
  {
    source: 'Introducing our next-generation platform designed to transform how enterprises manage their digital workflows. Built on cutting-edge AI technology, our solution reduces operational costs by up to 40% while increasing team productivity. Early adopters gain exclusive access to our premium feature set and dedicated onboarding support at no additional cost.',
    speedDraft: 'Bemutatjuk a következő generációs platformunkat, amelyet arra terveztek, hogy átalakítsa a vállalatok digitális munkafolyamatainak kezelési módját. Az élvonalbeli MI-technológiára épülő megoldásunk akár 40%-kal csökkenti az üzemeltetési költségeket, miközben növeli a csapat termelékenységét. A korai felhasználók exkluzív hozzáférést kapnak a prémium funkciókhoz és a dedikált onboarding-támogatáshoz, külön díj nélkül.',
    rag: 'Bemutatjuk következő generációs platformunkat, amely forradalmasítja a vállalati digitális munkafolyamatok kezelését. Élvonalbeli mesterséges intelligencia technológiánk akár 40%-os üzemeltetési költségcsökkentést és mérhetően magasabb csapathatékonyságot biztosít. A korai alkalmazók ingyenesen férhetnek hozzá a teljes prémium funkcionalitáshoz és a személyre szabott bevezetési támogatáshoz.',
  },
  {
    source: 'Patients enrolled in the clinical trial must meet all inclusion criteria and provide written informed consent prior to any study procedures. Adverse events should be reported within 24 hours of occurrence to the principal investigator. The study protocol has been approved by the Institutional Review Board and complies with Good Clinical Practice guidelines.',
    speedDraft: 'A klinikai vizsgálatba bevont betegeknek meg kell felelniük az összes bevonási kritériumnak, és írásos tájékozott beleegyezést kell adniuk a vizsgálati eljárások előtt. A nemkívánatos eseményeket a főnyomozónak 24 órán belül kell jelenteni. A vizsgálati protokollt az Intézményi Felülvizsgálati Testület jóváhagyta, és megfelel a Helyes Klinikai Gyakorlat irányelveinek.',
    rag: 'A klinikai vizsgálatba bevont betegeknek valamennyi befogadási kritériumnak meg kell felelniük, és a vizsgálati eljárások megkezdése előtt írásos tájékozott beleegyező nyilatkozatot kell aláírniuk. Az esetleges nemkívánatos eseményeket 24 órán belül kötelező jelezni a főkutató orvosnak. A vizsgálati protokollt az Etikai Bizottság jóváhagyta, és összhangban van az ICH E6(R2) Helyes Klinikai Gyakorlat-irányelveivel.',
  },
  {
    source: 'This agreement constitutes the entire understanding between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof. Any amendment to this contract must be made in writing and signed by authorized representatives of both parties. The prevailing party in any dispute arising from this agreement shall be entitled to recover reasonable legal fees.',
    speedDraft: 'Ez a megállapodás a felek közötti teljes megértést jelenti, és felváltja az erre vonatkozó tárgy összes korábbi tárgyalását, képviseletét vagy megállapodását. A szerződés bármely módosítását írásban kell elkészíteni, és mindkét fél felhatalmazott képviselőinek alá kell írniuk. Az ebből a megállapodásból eredő vitában győztes fél jogosult a megfelelő jogi díjak visszaszerzésére.',
    rag: 'Jelen szerződés a felek között létrejött teljes megállapodást testesíti meg, és hatálytalanít minden, a tárgyát érintő korábbi tárgyalást, nyilatkozatot vagy megállapodást. A szerződés módosítása kizárólag írásban, mindkét fél meghatalmazott képviselőjének aláírásával érvényes. A jelen szerződésből eredő jogvitában győztes fél jogosult az ésszerű mértékű ügyvédi és eljárási díjai megtérítésére.',
  },
  {
    source: 'Following the completion of our annual performance review cycle, we are pleased to announce updated compensation guidelines for the upcoming fiscal year. Employees who received an exceptional rating will be eligible for a merit increase of up to 8%. All managers are required to complete salary review discussions with their direct reports by the end of the month.',
    speedDraft: 'Az éves teljesítményértékelési ciklus befejezését követően örömmel jelentjük be a közelgő pénzügyi évre vonatkozó frissített bérezési irányelveket. A kivételes minősítésben részesült munkavállalók akár 8%-os érdememeléssel jogosultak. Minden vezető köteles a hónap végéig befejezni a bérfelülvizsgálati megbeszéléseket a közvetlen beosztottakkal.',
    rag: 'Az éves teljesítményértékelési ciklus lezárultával örömmel tájékoztatjuk munkatársainkat a következő üzleti évre vonatkozó bérezési keretrendszer frissítéséről. A kiváló minősítést elért munkavállalók legfeljebb 8%-os teljesítményalapú béremelésre jogosultak. Valamennyi vezető köteles a tárgyhónap végéig egyéni bérfelülvizsgálati megbeszélést folytatni közvetlen beosztottaival.',
  },
];

const SOURCE_TEXT = SAMPLE_POOL[0].source;
const CHAR_LIMIT  = 50000;
const ALL_SOURCE_LANGS = [
  'Autodetect language','Albanian','Albanian (Albania)','Arabic','Bosnian (Cyrillic)','Bosnian (Latin)',
  'Bulgarian','Catalan','Chinese','Chinese (Simplified)','Chinese (Traditional)','Croatian','Czech',
  'Danish','Dutch','English','English (Canada)','English (United Kingdom)','English (United States)',
  'Estonian','Finnish','French','French (Canada)','French (France)','French (Switzerland)',
  'German','German (Austria)','German (Germany)','German (Switzerland)','Greek','Haitian Creole',
  'Hebrew','Hindi','Hungarian','Indonesian','Irish','Italian','Japanese','Korean','Latvian',
  'Lithuanian','Macedonian','Norwegian','Norwegian (Bokmal)','Norwegian (Nynorsk)','Polish',
  'Portuguese','Portuguese (Brazil)','Portuguese (Portugal)','Romanian','Russian',
  'Serbian (Cyrillic)','Serbian (Latin)','Slovak','Slovenian','Spanish','Spanish (Argentina)',
  'Spanish (Mexico)','Spanish (Spain)','Swedish','Thai','Turkish','Ukrainian','Vietnamese','Welsh',
];
const ALL_TARGET_LANGS = ALL_SOURCE_LANGS.filter(l => l !== 'Autodetect language');
const SOURCE_LANGS = ALL_SOURCE_LANGS;
const TARGET_LANGS = ALL_TARGET_LANGS;
const DOMAIN_OPTIONS = ['Match source', 'Legal', 'Technical', 'Medical', 'Marketing', 'Custom'];
const TONE_OPTIONS   = ['Match source', 'Formal', 'Informal', 'Custom'];
const RAG_STEPS    = ['Translating...', 'Checking glossary and reference files...', 'Adapting tone...', "We're almost done..."];
const RAG_STEP_MS  = [1200, 1500, 1500, 1100];
const RAG_PROGRESS = [0, 25, 75, 95];

// ── Fake translation generator ────────────────────────────────────────────────
function buildFakeTranslation(sourceText) {
  const speedWords = SAMPLE_POOL.flatMap(s => s.speedDraft.split(/\s+/).filter(Boolean));
  const ragWords   = SAMPLE_POOL.flatMap(s => s.rag.split(/\s+/).filter(Boolean));
  const count = Math.max(1, sourceText.trim().split(/\s+/).filter(Boolean).length);
  const speed = Array.from({ length: count }, (_, i) => speedWords[i % speedWords.length]).join(' ');
  const rag   = Array.from({ length: count }, (_, i) => ragWords[i % ragWords.length]).join(' ');
  return { speed, rag };
}

// ── Theme factory ─────────────────────────────────────────────────────────────
function makeTheme(dark) {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary:   { main: orange[500], dark: orange[600], light: orange[400], contrastText: '#fff' },
      secondary: { main: blue[500],   dark: blue[600],   light: blue[400],   contrastText: '#fff' },
      success:   { main: green[600],  contrastText: '#fff' },
      text: dark
        ? { primary: 'rgba(255,255,255,0.87)', secondary: 'rgba(255,255,255,0.60)', disabled: 'rgba(255,255,255,0.38)' }
        : { primary: 'rgba(59,55,81,0.87)',    secondary: 'rgba(59,55,81,0.60)',    disabled: 'rgba(59,55,81,0.38)' },
      background: dark
        ? { default: '#1E1C2A', paper: '#2A2740' }
        : { default: '#FAFAFA', paper: '#ffffff' },
      divider: dark ? 'rgba(255,255,255,0.12)' : 'rgba(59,55,81,0.12)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton:        { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiOutlinedInput: { defaultProps: { color: 'secondary' } },
      MuiSelect:        { defaultProps: { color: 'secondary' } },
      MuiTab:           { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiAppBar:        { styleOverrides: { root: { boxShadow: 'none' } } },
      MuiChip:          { styleOverrides: { root: { fontWeight: 600 } } },
      MuiMenuItem:      { styleOverrides: { root: { fontSize: '0.875rem' } } },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
          PopperProps: { modifiers: [{ name: 'offset', options: { offset: [0, -8] } }] },
        },
        styleOverrides: {
          tooltip: { backgroundColor: blueGray[800], fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.3, letterSpacing: '0.4px' },
          arrow:   { color: blueGray[800] },
        },
      },
    },
  });
}

// ── Language selector ─────────────────────────────────────────────────────────
function LangBtn({ value, anchor, setAnchor, options, onChange, placeholder, containerRef, ariaLabel }) {
  const [search, setSearch] = React.useState('');
  const isMobile = useMediaQuery('(max-width:599.95px)');
  const filtered = search ? options.filter(l => l.toLowerCase().includes(search.toLowerCase())) : options;
  const open = Boolean(anchor);
  const handleClose = () => { setAnchor(null); setSearch(''); };

  return (
    <>
      <Button size="small"
        aria-label={ariaLabel || value}
        aria-expanded={open}
        aria-haspopup="listbox"
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16, ml: '-2px', transform: open ? 'rotate(180deg)' : 'none' }} />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          color: blue[500], fontWeight: 600,
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          textTransform: 'none',
          px: { xs: '8px', sm: '12px' }, py: '10px',
          borderRadius: '100px', border: 'none', lineHeight: 1.2,
          maxWidth: { xs: '140px', sm: 'none' },
          '& .MuiButton-endIcon': { flexShrink: 0 },
          '&:hover': { bgcolor: blue[50], color: blue[600] },
        }}>
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
          {value}
        </Box>
      </Button>
      <Popover
        open={open}
        anchorEl={containerRef ? containerRef.current : anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: {
          mt: 0.5,
          width: containerRef?.current ? containerRef.current.offsetWidth : '90vw',
          border: `1px solid ${blueGray[200]}`,
          borderRadius: '4px',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
        }}}>
        <Box sx={{ p: 1.5, borderBottom: `1px solid ${blueGray[100]}` }}>
          <TextField autoFocus fullWidth size="small"
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={placeholder || 'Search for language'}
            inputProps={{ 'aria-label': 'Search languages' }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: blueGray[400] }} /></InputAdornment>,
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')} aria-label="Clear search">
                    <CloseIcon sx={{ fontSize: 16, color: blueGray[400] }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { bgcolor: 'background.default', borderRadius: '4px' },
            }}
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: blueGray[200] } }}
          />
        </Box>
        <Box role="listbox" aria-label={placeholder || 'Select language'} sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: 0, p: 1,
          maxHeight: isMobile ? '50vh' : 'none',
          overflowY: isMobile ? 'auto' : 'visible',
        }}>
          {filtered.map(l => (
            <Box key={l} role="option" aria-selected={l === value}
              onClick={() => { onChange(l); handleClose(); }}
              sx={{
                px: 1.5, py: '7px', cursor: 'pointer', borderRadius: '4px',
                fontSize: '0.875rem', lineHeight: 1.4,
                fontWeight: l === value ? 700 : 400, color: 'text.primary',
                '&:hover': { bgcolor: blue[50], color: blue[600] },
              }}>
              {l}
            </Box>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ gridColumn: '1 / -1', py: 3, textAlign: 'center', color: blueGray[400], fontSize: '0.875rem' }}>
              No results
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}

// ── DS inline SVG icons ───────────────────────────────────────────────────────
function DsCheckCircleIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path d="M10.5068 16.4191L17.413 10.0581L16.0581 8.58698L10.6361 13.5809L8.47062 11.1875L6.98755 12.5294L10.5068 16.4191Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.04199 12C2.04199 17.514 6.52799 22 12.042 22C17.556 22 22.042 17.514 22.042 12C22.042 6.486 17.556 2 12.042 2C6.52799 2 2.04199 6.486 2.04199 12ZM4.04199 12C4.04199 7.589 7.63099 4 12.042 4C16.453 4 20.042 7.589 20.042 12C20.042 16.411 16.453 20 12.042 20C7.63099 20 4.04199 16.411 4.04199 12Z" fill="currentColor"/>
    </Box>
  );
}
function DsInfoCircleIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path d="M12.0022 22C6.4882 22 2.0022 17.515 2.0022 12C2.0022 6.487 6.4882 2 12.0022 2C17.5162 2 22.0022 6.486 22.0022 12C22.0022 17.515 17.5162 22 12.0022 22ZM12.0022 4C7.5912 4 4.0022 7.589 4.0022 12C4.0022 16.411 7.5912 20 12.0022 20C16.4132 20 20.0022 16.411 20.0022 12C20.0022 7.589 16.4132 4 12.0022 4Z" fill="currentColor"/>
      <path d="M13.0022 15V11C13.0022 10.448 12.5552 10 12.0022 10H10.0022V12H11.0022V15H9.0022V17H15.0022V15H13.0022Z" fill="currentColor"/>
      <path d="M12.0022 9.25C12.6926 9.25 13.2522 8.69036 13.2522 8C13.2522 7.30964 12.6926 6.75 12.0022 6.75C11.3118 6.75 10.7522 7.30964 10.7522 8C10.7522 8.69036 11.3118 9.25 12.0022 9.25Z" fill="currentColor"/>
    </Box>
  );
}
function DsInfoIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path d="M12.0022 22C6.4882 22 2.0022 17.515 2.0022 12C2.0022 6.487 6.4882 2 12.0022 2C17.5162 2 22.0022 6.486 22.0022 12C22.0022 17.515 17.5162 22 12.0022 22ZM12.0022 4C7.5912 4 4.0022 7.589 4.0022 12C4.0022 16.411 7.5912 20 12.0022 20C16.4132 20 20.0022 16.411 20.0022 12C20.0022 7.589 16.4132 4 12.0022 4Z" fill="currentColor"/>
      <path d="M13.0022 15V11C13.0022 10.448 12.5552 10 12.0022 10H10.0022V12H11.0022V15H9.0022V17H15.0022V15H13.0022Z" fill="currentColor"/>
      <path d="M12.0022 9.25C12.6926 9.25 13.2522 8.69036 13.2522 8C13.2522 7.30964 12.6926 6.75 12.0022 6.75C11.3118 6.75 10.7522 7.30964 10.7522 8C10.7522 8.69036 11.3118 9.25 12.0022 9.25Z" fill="currentColor"/>
    </Box>
  );
}
function DsMoonIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.35292 2.93877C9.6362 3.22204 9.72307 3.64704 9.57369 4.01876C9.20396 4.93879 9 5.94438 9 7.00006C9 11.4183 12.5817 15.0001 17 15.0001C18.0557 15.0001 19.0613 14.7961 19.9813 14.4264C20.353 14.277 20.778 14.3639 21.0613 14.6471C21.3446 14.9304 21.4314 15.3554 21.2821 15.7271C19.8051 19.4024 16.2071 22.0001 12 22.0001C6.47715 22.0001 2 17.5229 2 12.0001C2 7.79294 4.59771 4.19496 8.27293 2.718C8.64465 2.56861 9.06964 2.65549 9.35292 2.93877ZM7.08558 5.68677C5.20699 7.1513 4 9.43543 4 12.0001C4 16.4183 7.58172 20.0001 12 20.0001C14.5646 20.0001 16.8488 18.7931 18.3133 16.9145C17.8833 16.9709 17.4449 17.0001 17 17.0001C11.4772 17.0001 7 12.5229 7 7.00006C7 6.55516 7.02911 6.11677 7.08558 5.68677Z" fill="currentColor"/>
    </Box>
  );
}
function DsTranslateIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path d="M23 10H16V12H22V22H12V16H10V23C10 23.553 10.448 24 11 24H23C23.553 24 24 23.553 24 23V11C24 10.447 23.553 10 23 10Z" fill="currentColor"/>
      <path d="M14.919 21.394L15.517 20H18.484L19.082 21.394L20.92 20.606L17.92 13.606C17.762 13.238 17.4 13 17 13C16.601 13 16.238 13.238 16.081 13.606L13.081 20.606L14.919 21.394ZM17.627 18H16.374L17 16.538L17.627 18Z" fill="currentColor"/>
      <path d="M6 7.381L7 7.881L8 7.381V6H6V7.381Z" fill="currentColor"/>
      <path d="M14 0H0V14H14V0ZM12 6H10V8C10 8.379 9.786 8.726 9.447 8.894L9.236 9L11.447 10.105L10.552 11.894L7 10.118L3.447 11.894L2.552 10.105L4.764 9L4.553 8.894C4.214 8.725 4 8.378 4 8V6H2V4H6V2H8V4H12V6Z" fill="currentColor"/>
      <path d="M23 3H19.414L20.707 1.707L19.293 0.292999L15.586 4L19.293 7.707L20.707 6.293L19.414 5H22V8H24V4C24 3.447 23.553 3 23 3Z" fill="currentColor"/>
      <path d="M4.293 17.707L5.586 19H2V16H0V20C0 20.553 0.448 21 1 21H5.586L4.293 22.293L5.707 23.707L9.414 20L5.707 16.293L4.293 17.707Z" fill="currentColor"/>
    </Box>
  );
}
function DsDocumentUploadIcon({ size = 20, sx = {} }) {
  return (
    <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" sx={{ flexShrink: 0, ...sx }} aria-hidden="true">
      <path d="M12 9H4V11H12V9Z" fill="currentColor"/>
      <path d="M10 13H4V15H10V13Z" fill="currentColor"/>
      <path d="M16 6V11H18V4.586L13.414 0H2C0.897 0 0 0.898 0 2V20C0 21.103 0.897 22 2 22H12V20H2V2H12V6H16Z" fill="currentColor"/>
      <path d="M19 14.585L14.293 19.292L15.707 20.706L18 18.413V24H20V18.413L22.293 20.706L23.707 19.292L19 14.585Z" fill="currentColor"/>
    </Box>
  );
}

// ── RAG progress bar (standalone component) ───────────────────────────────────
function RagProgressBar({ ragStep }) {
  return (
    <Box role="status" aria-live="polite" aria-label={RAG_STEPS[ragStep]}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="caption" fontWeight={600}
        sx={{ color: 'text.primary', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {RAG_STEPS[ragStep]}
      </Typography>
      <LinearProgress variant="determinate" value={RAG_PROGRESS[ragStep]}
        aria-valuenow={RAG_PROGRESS[ragStep]} aria-valuemin={0} aria-valuemax={100}
        sx={{
          flex: 1, height: 4, borderRadius: 2, bgcolor: blueGray[200],
          '& .MuiLinearProgress-bar': {
            bgcolor: blue[500], borderRadius: 2,
            transition: 'transform 0.8s ease',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          },
        }}
      />
      <Typography variant="caption" fontWeight={600}
        sx={{ color: blueGray[500], flexShrink: 0, minWidth: 32, textAlign: 'right' }}>
        {RAG_PROGRESS[ragStep]}%
      </Typography>
    </Box>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = makeTheme(darkMode);
  const isMobile = useMediaQuery('(max-width:599.95px)');

  const [mainTab, setMainTab] = useState(0);
  const [sourceLang, setSourceLang] = useState('English (United States)');
  const [targetLang, setTargetLang] = useState('Hungarian');
  const [domain, setDomain] = useState('Match source');
  const [tone, setTone]     = useState('Match source');

  const [sourceText, setSourceText] = useState(SOURCE_TEXT);
  const taRef      = useRef(null);
  const langBarRef = useRef(null);

  const [ragEnabled, setRagEnabled]         = useState(false);
  const [ragDialogShown, setRagDialogShown] = useState(false);
  const [showRagDialog, setShowRagDialog]   = useState(false);
  const [pendingRag, setPendingRag]         = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [ragConfirmed, setRagConfirmed]     = useState(false);
  const [ragTrialMode, setRagTrialMode]     = useState(false);
  const [ragEverTried, setRagEverTried]     = useState(false);
  const [prevTranslation, setPrevTranslation]   = useState('');
  const [sampleIdx, setSampleIdx]               = useState(0);
  const [generatedTranslation, setGeneratedTranslation] = useState({ speed: '', rag: '' });

  const [phase, setPhase]     = useState('idle');
  const [ragStep, setRagStep] = useState(0);

  const [snackMsg, setSnackMsg]   = useState(null);
  const [snackType, setSnackType] = useState('success');
  const [snackPos, setSnackPos]   = useState('left');

  const [showSettings, setShowSettings] = useState(false);
  const [tempDomain, setTempDomain]     = useState('Match source');
  const [tempTone, setTempTone]         = useState('Match source');
  const [domainCustom, setDomainCustom] = useState('');
  const [toneCustom, setToneCustom]     = useState('');
  const [srcA, setSrcA]     = useState(null);
  const [tgtA, setTgtA]     = useState(null);
  const [avatarA, setAvatarA] = useState(null);

  // Auto-resize textarea when sourceText changes externally (paste, clear)
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    }
  }, [sourceText]);

  useEffect(() => {
    if (phase !== 'translating_speed') return;
    const t = setTimeout(() => setPhase('result_speed'), 1700);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'rag_translating') return;
    setRagStep(0);
    let i = 0;
    const ids = [];
    const next = () => {
      i++;
      if (i < RAG_STEPS.length) {
        setRagStep(i);
        ids.push(setTimeout(next, RAG_STEP_MS[i]));
      } else {
        setRagEverTried(true);
        setPhase(ragConfirmed ? 'result_rag' : 'result_rag_first');
      }
    };
    ids.push(setTimeout(next, RAG_STEP_MS[0]));
    return () => ids.forEach(clearTimeout);
  }, [phase]); // eslint-disable-line

  const snack = (msg, type = 'success', pos = 'left') => { setSnackMsg(msg); setSnackType(type); setSnackPos(pos); };

  const openSettings = () => {
    const domainIsCustom = !DOMAIN_OPTIONS.filter(o => o !== 'Custom').includes(domain);
    const toneIsCustom   = !TONE_OPTIONS.filter(o => o !== 'Custom').includes(tone);
    setTempDomain(domainIsCustom ? 'Custom' : domain);
    setTempTone(toneIsCustom ? 'Custom' : tone);
    setDomainCustom(domainIsCustom ? domain : '');
    setToneCustom(toneIsCustom ? tone : '');
    setShowSettings(true);
  };

  const applySettings = () => {
    setDomain(tempDomain === 'Custom' ? domainCustom.trim() : tempDomain);
    setTone(tempTone === 'Custom' ? toneCustom.trim() : tempTone);
    setShowSettings(false);
  };

  const settingsValid = () => {
    const domainOk = tempDomain !== 'Custom' || (domainCustom.trim().length >= 3 && domainCustom.length <= 32);
    const toneOk   = tempTone   !== 'Custom' || (toneCustom.trim().length >= 3   && toneCustom.length   <= 32);
    return domainOk && toneOk;
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    setRagTrialMode(false);
    const newT = buildFakeTranslation(sourceText);
    setGeneratedTranslation(newT);
    if (hasResult) setPrevTranslation(translation);
    else setPrevTranslation('');
    if (ragEnabled) {
      if (!ragDialogShown) { setPendingRag(true); setShowRagDialog(true); }
      else { setRagStep(0); setPhase('rag_translating'); }
    } else {
      setOfferDismissed(false);
      setPhase('translating_speed');
    }
  };

  const handleCancel = () => { setPhase('idle'); setPrevTranslation(''); };

  const handleDialogOk = () => {
    setShowRagDialog(false);
    setRagDialogShown(true);
    if (pendingRag) { setPendingRag(false); setRagStep(0); setPhase('rag_translating'); }
  };

  const handleRagCheck = (checked) => {
    setRagEnabled(checked);
    if (checked) {
      if (!ragDialogShown) { setShowRagDialog(true); }
      else if (ragEverTried) { snack('Match company language is on.', 'success'); }
    } else {
      if (ragEverTried) { snack('Match company language is off.', 'info'); }
    }
  };

  const handleTryIt = () => {
    setGeneratedTranslation(buildFakeTranslation(sourceText));
    if (hasResult) setPrevTranslation(translation);
    setRagTrialMode(true);
    setRagDialogShown(true);
    setOfferDismissed(true);
    setRagStep(0); setPhase('rag_translating');
  };

  const handleKeepUsing = () => {
    setRagConfirmed(true); setRagTrialMode(false); setRagEnabled(true);
    setPhase('result_rag');
    snack("You're now using company language in translations.", 'success');
  };

  const handleNotNow = () => {
    setRagTrialMode(false);
    setPhase('result_rag');
    snack("You're no longer using company language in translations.", 'info');
  };

  const handleSwap = () => { const t = sourceLang; setSourceLang(targetLang); setTargetLang(t); };

  const handleClear = () => {
    setSourceText(''); setPhase('idle'); setOfferDismissed(false);
    setTimeout(() => taRef.current?.focus(), 0);
  };

  const handlePaste = async () => {
    const pool = SAMPLE_POOL;
    let next = sampleIdx;
    while (next === sampleIdx) next = Math.floor(Math.random() * pool.length);
    setSampleIdx(next);
    setSourceText(pool[next].source);
    setPhase('idle'); setPrevTranslation(''); setOfferDismissed(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation).catch(() => {});
    snack('Translation copied to clipboard.', 'success', 'right');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const charsLeft     = CHAR_LIMIT - sourceText.length;
  const isTranslating = phase === 'translating_speed' || phase === 'rag_translating';
  const isSpeedResult = phase === 'result_speed';
  const isRagResult   = phase === 'result_rag_first' || phase === 'result_rag';
  const hasResult     = isSpeedResult || isRagResult;
  const canTranslate  = sourceText.trim().length > 0 && !isTranslating;
  const showOffer     = isSpeedResult && !ragEnabled && !ragEverTried;
  const showKeepUsing = phase === 'result_rag_first' && ragTrialMode;
  const translation = isRagResult ? generatedTranslation.rag : generatedTranslation.speed;
  const H = 56, SN = 52;
  const placeholderColor = darkMode ? '#615D7B' : '#ACA9BD';

  // Shared chip style
  const chipSx = {
    bgcolor: blue[500], color: '#fff', height: 24, fontSize: '0.75rem',
    cursor: 'pointer', borderRadius: '4px', fontWeight: 600,
    px: '8px', display: 'inline-flex', alignItems: 'center',
    letterSpacing: '0.4px', lineHeight: 1.3,
    '&:hover': { bgcolor: blue[600] }, userSelect: 'none',
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        textarea.fs-ta::placeholder { color: ${placeholderColor}; }
        textarea.fs-ta:focus { outline: none; }
        .fluent-source-panel:has(textarea:focus) { box-shadow: inset 0 0 0 2px ${blue[500]}, 0px 2px 4px 0px rgba(0,0,0,0.08) !important; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <span id="translate-hint" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        Enter text to translate
      </span>

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ══ AppBar ══════════════════════════════════════════════════════════ */}
        <AppBar position={isMobile ? 'relative' : 'fixed'} elevation={0} sx={{ bgcolor: '#27336F', height: H, zIndex: 1300 }}>
          <Toolbar sx={{ minHeight: `${H}px !important`, px: { xs: 2, sm: 3 }, gap: 1 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', mr: 'auto' }}>
              Fluent
            </Typography>

            <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
              <IconButton size="small" onClick={() => setDarkMode(d => !d)}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: '#fff' } }}>
                {darkMode ? <LightModeOutlinedIcon sx={{ fontSize: 19 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>

            <Button size="small" aria-label="Change interface language"
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14, ml: '-6px' }} />}
              sx={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', textTransform: 'none', px: 1, minWidth: 0, opacity: 0.9, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}>
              EN
            </Button>

            <Tooltip title="Help">
              <IconButton size="small" aria-label="Help"
                sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: '#fff' } }}>
                <HelpOutlineIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <Box role="button" tabIndex={0} aria-label="Account menu"
                onClick={(e) => setAvatarA(e.currentTarget)}
                onKeyDown={(e) => e.key === 'Enter' && setAvatarA(e.currentTarget)}
                sx={{
                  width: 30, height: 30, borderRadius: '50%', cursor: 'pointer',
                  bgcolor: blue[500], color: '#fff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '-0.01em',
                  '&:hover': { bgcolor: blue[600] },
                }}>AB</Box>
            </Tooltip>

            <Menu anchorEl={avatarA} open={Boolean(avatarA)} onClose={() => setAvatarA(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: snackPos }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ mt: 0.75 }} PaperProps={{ sx: { minWidth: 210 } }}>
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight={700}>Alex Brown</Typography>
                <Typography variant="caption" color="text.secondary">alex.brown@company.com</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => setAvatarA(null)} sx={{ gap: 1.5 }}>
                <PersonOutlineIcon fontSize="small" sx={{ color: 'action.active' }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => setAvatarA(null)} sx={{ gap: 1.5 }}>
                <SettingsOutlinedIcon fontSize="small" sx={{ color: 'action.active' }} /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setAvatarA(null)} sx={{ gap: 1.5, color: 'error.main' }}>
                <LogoutOutlinedIcon fontSize="small" /> Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* ══ Sub-nav — minden breakpointon látható ════════════════════════════ */}
        <Box sx={{
          position: { xs: 'relative', sm: 'fixed' },
          top: { xs: 'unset', sm: H },
          left: { xs: 'unset', sm: 0 },
          right: { xs: 'unset', sm: 0 },
          zIndex: { xs: 'auto', sm: 1200 },
          bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', height: SN,
        }}>
          <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%', height: '100%', display: 'flex', alignItems: 'center', px: { xs: 2, sm: 3, md: 4 } }}>
            <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} sx={{
              minHeight: SN,
              '& .MuiTab-root': { minHeight: SN, py: 0, px: 2, fontSize: '0.875rem', color: blueGray[500] },
              '& .Mui-selected': { color: '#27336F !important' },
              '& .MuiTabs-indicator': { bgcolor: '#27336F', height: 2 },
            }}>
              <Tab icon={<DsTranslateIcon size={18} sx={{ color: 'currentColor', mr: 0.75 }} />} iconPosition="start" label="Text translation" />
              <Tab icon={<DsDocumentUploadIcon size={18} sx={{ color: 'currentColor', mr: 0.75 }} />} iconPosition="start" label="File translation" />
            </Tabs>
            <Box sx={{ flex: 1 }} />
            {/* Domain/Tone chipek — csak desktopon a sub-navban */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75, mr: 1 }}>
              <Typography variant="caption" color="text.secondary">Domain:</Typography>
              <Box onClick={openSettings} sx={chipSx}>{domain}</Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>Tone:</Typography>
              <Box onClick={openSettings} sx={chipSx}>{tone}</Box>
            </Box>
          </Box>
        </Box>

        {/* Spacer — csak desktopon kell, ahol az AppBar fixed */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, height: H + SN, flexShrink: 0 }} />

        {/* ══ Page body ════════════════════════════════════════════════════════ */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', maxWidth: 1400, width: '100%', mx: 'auto' }}>

          {/* Language bar */}
          <Box ref={langBarRef} sx={{ bgcolor: 'background.default', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 1, sm: 2 }, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <LangBtn value={sourceLang} anchor={srcA} setAnchor={setSrcA}
                options={SOURCE_LANGS} onChange={setSourceLang} containerRef={langBarRef}
                placeholder="Search for source language" ariaLabel={`Source language: ${sourceLang}`} />
            </Box>
            <Tooltip title="Swap languages">
              <IconButton size="small" onClick={handleSwap} aria-label="Swap languages"
                sx={{ color: 'rgba(59,55,81,0.54)', width: 36, height: 36, mx: 0.5, '&:hover': { bgcolor: blueGray[100], color: blueGray[700] } }}>
                <SwapHorizIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <LangBtn value={targetLang} anchor={tgtA} setAnchor={setTgtA}
                options={TARGET_LANGS} onChange={setTargetLang} containerRef={langBarRef}
                placeholder="Search for target language" ariaLabel={`Target language: ${targetLang}`} />
            </Box>
          </Box>


          {/* Domain/Tone chipek — csak mobilon, a language bar alatt */}
          {isMobile && (
            <Box sx={{ px: 2, pt: 1, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary">Domain:</Typography>
              <Box onClick={openSettings} role="button" tabIndex={0}
                aria-label={`Domain: ${domain}. Tap to change`}
                onKeyDown={(e) => e.key === 'Enter' && openSettings()}
                sx={chipSx}>{domain}</Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>Tone:</Typography>
              <Box onClick={openSettings} role="button" tabIndex={0}
                aria-label={`Tone: ${tone}. Tap to change`}
                onKeyDown={(e) => e.key === 'Enter' && openSettings()}
                sx={chipSx}>{tone}</Box>
            </Box>
          )}

          {/* ══ Two columns (desktop) / single column (mobile) ═══════════════ */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
            px: { xs: 2, sm: 3, md: 4 },
            pt: 0, pb: 2, gap: 2,
            alignItems: 'flex-start',
          }}>

            {/* ── Source column ── */}
            <Box sx={{ flex: { xs: '0 0 auto', sm: '1 1 400px' }, width: { xs: '100%', sm: 'auto' }, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={0} className="fluent-source-panel" sx={{
                position: 'relative',
                border: '0.8px solid rgba(59,55,81,0.18)',
                bgcolor: '#FAFAFD',
                boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.5s',
                '&:hover': { boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.08)' },
                display: 'flex', flexDirection: 'column', borderRadius: '4px',
                minHeight: { xs: 160, sm: 220 },
              }}>
                <textarea
                  ref={taRef}
                  className="fs-ta"
                  value={sourceText}
                  placeholder="Start typing or paste content here"
                  aria-label="Source text"
                  aria-describedby={!canTranslate ? 'translate-hint' : undefined}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, CHAR_LIMIT);
                    setSourceText(v);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    if (hasResult) { setPhase('idle'); setOfferDismissed(false); }
                  }}
                  style={{
                    border: 'none', outline: 'none', resize: 'none',
                    padding: isMobile ? '16px 52px 10px 16px' : '20px 56px 12px 20px',
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    lineHeight: 1.6, color: 'inherit', backgroundColor: 'transparent',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
                    width: '100%', boxSizing: 'border-box',
                    minHeight: isMobile ? 160 : 280,
                    height: 'auto', overflow: 'hidden',
                  }}
                />

                {/* Paste / Clear — absolute, top-right */}
                {!sourceText
                  ? <Tooltip title="Paste from clipboard">
                      <IconButton size="large" onClick={handlePaste} aria-label="Paste from clipboard"
                        sx={{ position: 'absolute', top: 8, right: 8, color: blueGray[400], '&:hover': { color: blueGray[700] } }}>
                        <ContentPasteIcon sx={{ fontSize: 24 }} />
                      </IconButton>
                    </Tooltip>
                  : <Tooltip title="Clear">
                      <IconButton size="large" onClick={handleClear} aria-label="Clear text"
                        sx={{ position: 'absolute', top: 8, right: 8, color: blueGray[400], '&:hover': { color: blueGray[700] } }}>
                        <CloseIcon sx={{ fontSize: 24 }} />
                      </IconButton>
                    </Tooltip>
                }

                {/* ── Desktop: char counter ── */}
                {!isMobile && (
                  <Typography variant="caption" role="status" aria-live="polite" aria-atomic="true"
                    sx={{ px: '20px', pb: '14px', pt: '6px', color: blueGray[400], display: 'block', flexShrink: 0 }}>
                    {charsLeft.toLocaleString()} characters left.
                  </Typography>
                )}

                {/* ── Mobile: char counter + RAG checkbox + Translate — inside panel ── */}
                {isMobile && (
                  <>
                    <Divider />
                    {/* Row 1: Char counter */}
                    <Box sx={{ px: 2, pt: 1.25, pb: 0.5 }}>
                      <Typography variant="caption" role="status" aria-live="polite" aria-atomic="true"
                        sx={{ color: blueGray[400] }}>
                        {charsLeft.toLocaleString()} characters left.
                      </Typography>
                    </Box>

                    {/* Row 2: Match company language left + Translate/Cancel right, 32px gap */}
                    <Box sx={{ px: 2, pb: 2, pt: 0.25, display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Checkbox size="small" checked={ragEnabled}
                            onChange={(e) => handleRagCheck(e.target.checked)}
                            inputProps={{ 'aria-label': 'Match company language' }}
                            sx={{ color: blueGray[400], p: '4px', '&.Mui-checked': { color: blue[500] } }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" color="text.primary">Match company language</Typography>
                            <Tooltip title="It's checking your glossaries and internal reference files to keep translations consistent. It can add 3-5 seconds to processing time." arrow>
                              <Box component="span" sx={{ cursor: 'help', display: 'flex', alignItems: 'center' }}>
                                <DsInfoIcon size={14} sx={{ color: blueGray[400] }} />
                              </Box>
                            </Tooltip>
                          </Box>
                        }
                        sx={{ m: 0, flex: 1 }}
                      />
                      <Box sx={{ width: 32, flexShrink: 0 }} />
                      {isTranslating
                        ? <Button variant="outlined" size="large" onClick={handleCancel}
                            aria-label="Cancel translation"
                            startIcon={<CircularProgress size={15} thickness={4} sx={{ color: blueGray[600] }} />}
                            sx={{
                              borderRadius: 20, fontWeight: 700, flexShrink: 0,
                              borderColor: blueGray[300], color: blueGray[700],
                              '&:hover': { borderColor: blueGray[500], bgcolor: blueGray[50] },
                              '& .MuiButton-startIcon': { mr: '6px' },
                            }}>
                            Cancel
                          </Button>
                        : <Button variant="contained" size="large"
                            disabled={!canTranslate} onClick={handleTranslate}
                            aria-disabled={!canTranslate}
                            aria-describedby={!canTranslate ? 'translate-hint' : undefined}
                            sx={{
                              borderRadius: 20, fontWeight: 700, flexShrink: 0,
                              bgcolor: '#27336F', color: '#fff',
                              '&:hover': { bgcolor: '#1F2A5E' },
                              '&.Mui-disabled': { bgcolor: blueGray[200], color: blueGray[400] },
                            }}>
                            Translate
                          </Button>
                      }
                    </Box>
                  </>
                )}
              </Paper>

              {/* ── Desktop action row: RAG checkbox + Translate ── */}
              <Box sx={{ mt: '16px', display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox size="small" checked={ragEnabled}
                      onChange={(e) => handleRagCheck(e.target.checked)}
                      inputProps={{ 'aria-label': 'Match company language' }}
                      sx={{ color: blueGray[400], p: '4px', '&.Mui-checked': { color: blue[500] } }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.primary">Match company language</Typography>
                      <Tooltip title="It's checking your glossaries and internal reference files to keep translations consistent. It can add 3-5 seconds to processing time." arrow>
                        <Box component="span" sx={{ cursor: 'help', display: 'flex', alignItems: 'center' }}>
                          <DsInfoIcon size={16} sx={{ color: blueGray[400], '&:hover': { color: blueGray[600] } }} />
                        </Box>
                      </Tooltip>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
                <Box sx={{ flex: 1 }} />
                {isTranslating
                  ? <Button variant="outlined" size="large" onClick={handleCancel}
                      aria-label="Cancel translation"
                      startIcon={<CircularProgress size={15} thickness={4} sx={{ color: blueGray[600] }} />}
                      sx={{
                        borderRadius: 20, px: 3, fontWeight: 700,
                        borderColor: blueGray[300], color: blueGray[700],
                        '&:hover': { borderColor: blueGray[500], bgcolor: blueGray[50] },
                        '& .MuiButton-startIcon': { mr: '6px' },
                      }}>
                      Cancel
                    </Button>
                  : <Button variant="contained" size="large" disabled={!canTranslate} onClick={handleTranslate}
                      aria-disabled={!canTranslate}
                      aria-describedby={!canTranslate ? 'translate-hint' : undefined}
                      sx={{
                        borderRadius: 20, px: 3, fontWeight: 700,
                        bgcolor: '#27336F', color: '#fff',
                        '&:hover': { bgcolor: '#1F2A5E' },
                        '&.Mui-disabled': { bgcolor: blueGray[200], color: blueGray[400] },
                      }}>
                      Translate
                    </Button>
                }
              </Box>

              {/* ── RAG progress — mobile: between panels ── */}
              {phase === 'rag_translating' && isMobile && (
                <Box sx={{ mt: 2 }}>
                  <RagProgressBar ragStep={ragStep} />
                </Box>
              )}
            </Box>

            {/* ── Target column ── */}
            <Box sx={{ flex: { xs: '0 0 auto', sm: '1 1 400px' }, width: { xs: '100%', sm: 'auto' }, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={0} sx={{
                position: 'relative',
                border: '0.8px solid rgba(59,55,81,0.18)',
                bgcolor: '#FAFAFD',
                boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.5s',
                '&:hover': { boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.08)' },
                display: 'flex', flexDirection: 'column', borderRadius: '4px',
                minHeight: { xs: 160, sm: 220 },
              }}>
                {isTranslating && (
                  prevTranslation
                    ? <Box sx={{ flex: 1, p: { xs: '16px', sm: '20px' }, pb: 1, opacity: 0.35 }}>
                        <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {prevTranslation}
                        </Typography>
                      </Box>
                    : <Box sx={{ flex: 1, p: { xs: '16px', sm: '20px' } }}>
                        <Skeleton variant="text" width="92%" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 1, borderRadius: '4px', bgcolor: blueGray[200] }} />
                        <Skeleton variant="text" width="75%" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 1, borderRadius: '4px', bgcolor: blueGray[200] }} />
                        <Skeleton variant="text" width="60%" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, borderRadius: '4px', bgcolor: blueGray[200] }} />
                      </Box>
                )}

                {hasResult && (
                  <Box aria-live="polite" aria-atomic="false"
                    sx={{ p: { xs: '16px', sm: '20px' }, pb: 1 }}>
                    <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      {translation}
                    </Typography>
                  </Box>
                )}

                {!isTranslating && !hasResult && <Box sx={{ flex: 1 }} />}

                <Box sx={{ px: { xs: '16px', sm: '20px' }, pb: { xs: '12px', sm: '14px' }, pt: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {phase === 'rag_translating' && prevTranslation
                    ? <Box sx={{ bgcolor: blue[500], color: '#fff', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.4px', lineHeight: 1.3, px: '8px', py: '4px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>Refining</Box>
                    : hasResult
                    ? (isRagResult
                        ? <Box sx={{ bgcolor: green[600], color: '#fff', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.4px', lineHeight: 1.3, px: '8px', py: '4px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>Matched company language</Box>
                        : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Box sx={{ bgcolor: 'rgba(59,55,81,0.08)', color: 'rgba(59,55,81,0.87)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.4px', lineHeight: 1.3, px: '8px', py: '4px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>Quick translation</Box>
                            {ragEverTried && (
                              <Button variant="text" size="small" onClick={handleTryIt}
                                sx={{ color: blue[500], fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', p: 0, minWidth: 0, letterSpacing: '0.15px', lineHeight: 1.3, '&:hover': { bgcolor: 'transparent', color: blue[600], textDecoration: 'underline' } }}>
                                Refine with your company language
                              </Button>
                            )}
                          </Box>
                      )
                    : <Box />
                  }
                  {(hasResult || phase === 'rag_translating') && (
                    <Tooltip title="Copy translation">
                      <span>
                        <IconButton size="large" onClick={handleCopy} disabled={!hasResult}
                          aria-label="Copy translation"
                          sx={{ color: blueGray[400], '&:hover': { color: blueGray[700] } }}>
                          <ContentCopyIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                </Box>
              </Paper>

              {/* ── RAG progress — desktop: below target panel ── */}
              {phase === 'rag_translating' && !isMobile && (
                <Box sx={{ mt: '27px' }}>
                  <RagProgressBar ragStep={ragStep} />
                </Box>
              )}

              {/* Offer banner */}
              {showOffer && (
                <Box sx={{ mt: '16px', display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: blue[50], border: `1px solid ${blue[200]}`, borderRadius: '4px' }}>
                  <AutoAwesomeIcon sx={{ color: blue[500], fontSize: 18, mt: '2px', flexShrink: 0 }} aria-hidden="true" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>Need to match your company's language?</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      Fluent can use your glossaries and internal reference files to keep translations consistent and tailored to your needs.
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" onClick={handleTryIt}
                    sx={{ borderColor: blue[300], color: blue[600], whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { borderColor: blue[500], bgcolor: blue[50] } }}>
                    Try it
                  </Button>
                </Box>
              )}

              {/* Keep using banner */}
              {showKeepUsing && (
                <Box sx={{ mt: '16px', display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: blue[50], border: `1px solid ${blue[200]}`, borderRadius: '4px' }}>
                  <AutoAwesomeIcon sx={{ color: blue[500], fontSize: 18, mt: '2px', flexShrink: 0 }} aria-hidden="true" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>Keep future translations consistent with company language?</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      Translations may take a few seconds longer. You can turn off language matching at any time.
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" onClick={handleNotNow}
                    sx={{ borderColor: blueGray[300], color: blueGray[700], whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { borderColor: blueGray[500], bgcolor: blueGray[50] } }}>
                    Not now
                  </Button>
                  <Button variant="contained" size="small" onClick={handleKeepUsing}
                    sx={{ bgcolor: '#27336F', color: '#fff', whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { bgcolor: '#1F2A5E' } }}>
                    Yes, keep using
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* ══ Footer — desktop only ════════════════════════════════════════════ */}
        <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 4 }, height: 56, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src={`${import.meta.env.BASE_URL}${darkMode ? 'logo-dark.svg' : 'logo-light.svg'}`} alt="Language Intelligence" sx={{ height: 28 }} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            © 2026 Fluent by Language Intelligence
          </Typography>
        </Box>

        {/* ══ Settings dialog ══════════════════════════════════════════════════ */}
        <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="xs" fullWidth
          PaperProps={{ sx: { borderRadius: '4px', mx: { xs: 2, sm: 'auto' } } }}>
          <DialogContent sx={{ pt: 0, px: 0, pb: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Settings</Typography>
              <IconButton size="small" onClick={() => setShowSettings(false)} aria-label="Close settings" sx={{ color: blueGray[500] }}>
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>Domain</Typography>
              <Select fullWidth size="small" color="secondary" value={tempDomain} onChange={e => setTempDomain(e.target.value)}
                inputProps={{ 'aria-label': 'Domain' }} sx={{ borderRadius: '4px' }}>
                {DOMAIN_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
              {tempDomain === 'Custom' && (
                <Box sx={{ mt: 1.5, mb: 1 }}>
                  <TextField autoFocus fullWidth size="small" value={domainCustom} onChange={e => setDomainCustom(e.target.value)}
                    placeholder="Define the domain you would like to use"
                    inputProps={{ maxLength: 64, 'aria-label': 'Custom domain' }}
                    error={domainCustom.length > 32}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                  <Typography variant="caption" sx={{ color: domainCustom.length > 32 ? 'error.main' : blueGray[500], mt: 0.5, display: 'block' }}>
                    {Math.max(0, 32 - domainCustom.length)} characters left.
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>Tone of voice</Typography>
              <Select fullWidth size="small" color="secondary" value={tempTone} onChange={e => setTempTone(e.target.value)}
                inputProps={{ 'aria-label': 'Tone of voice' }} sx={{ borderRadius: '4px' }}>
                {TONE_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
              {tempTone === 'Custom' && (
                <Box sx={{ mt: 1.5, mb: 1 }}>
                  <TextField autoFocus fullWidth size="small" value={toneCustom} onChange={e => setToneCustom(e.target.value)}
                    placeholder="Define the tone of voice you would like to use"
                    inputProps={{ maxLength: 64, 'aria-label': 'Custom tone of voice' }}
                    error={toneCustom.length > 32}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                  <Typography variant="caption" sx={{ color: toneCustom.length > 32 ? 'error.main' : blueGray[500], mt: 0.5, display: 'block' }}>
                    {Math.max(0, 32 - toneCustom.length)} characters left.
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: blueGray[50], borderTop: `1px solid ${blueGray[100]}` }}>
            <Button variant="text" onClick={() => setShowSettings(false)} sx={{ color: blue[500], fontWeight: 600, textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" disabled={!settingsValid()} onClick={applySettings}
              sx={{ bgcolor: '#27336F', color: '#fff', borderRadius: 20, px: 3, '&:hover': { bgcolor: '#1F2A5E' }, '&.Mui-disabled': { bgcolor: blueGray[200], color: blueGray[400] } }}>
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* ══ RAG first-time dialog ════════════════════════════════════════════ */}
        <Dialog open={showRagDialog} maxWidth="xs" fullWidth
          PaperProps={{ sx: { borderRadius: '4px', mx: { xs: 2, sm: 'auto' } } }}>
          <DialogContent sx={{ pt: 3, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeIcon sx={{ color: blue[500], fontSize: 22 }} aria-hidden="true" />
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                Match company language is on
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>
              We're checking your glossaries and internal reference files to keep translations consistent.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
              Best for policy, legal, and public-facing content where terminology matters.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
              You can turn it off anytime.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: blue[50], border: `1px solid ${blue[200]}`, borderRadius: '4px', p: 1.5 }}>
              <DsInfoCircleIcon size={16} sx={{ color: blue[500], mt: '1px', flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                It can add 3-5 seconds to processing time.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: blueGray[50], borderTop: `1px solid ${blueGray[100]}` }}>
            <Button variant="contained" onClick={handleDialogOk}
              sx={{ bgcolor: '#27336F', color: '#fff', borderRadius: 20, px: 3, '&:hover': { bgcolor: '#1F2A5E' } }}>
              Got it
            </Button>
          </DialogActions>
        </Dialog>

        {/* ══ Snackbar ════════════════════════════════════════════════════════ */}
        <Snackbar
          open={Boolean(snackMsg)}
          autoHideDuration={4000}
          onClose={() => setSnackMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Paper elevation={0} sx={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            bgcolor: '#FAFAFD', border: `1px solid ${blueGray[100]}`, borderRadius: '4px',
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.08)',
            px: 2, py: '6px', minHeight: 52, minWidth: 220, maxWidth: 420,
          }}>
            <Box sx={{ pt: '10px', flexShrink: 0 }}>
              {snackType === 'success'
                ? <DsCheckCircleIcon size={20} sx={{ color: green[600] }} />
                : <DsInfoCircleIcon  size={20} sx={{ color: blue[500] }} />
              }
            </Box>
            <Box sx={{ flex: 1, py: '10px' }}>
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.4, letterSpacing: '0.15px', fontWeight: 400 }}>
                {snackMsg}
              </Typography>
            </Box>
          </Paper>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}
