#!/bin/bash
# Checks and fixes App.jsx truncation
FILE="/sessions/determined-funny-tesla/mnt/DS/fluent-prototype/src/App.jsx"
CLOSING='    </ThemeProvider>
  );
}'

LAST_LINE=$(tail -1 "$FILE" | tr -d '\r\n ')
if [ "$LAST_LINE" != "}" ]; then
  echo "TRUNCATED — fixing..."
  python3 -c "
data = open('$FILE','rb').read().rstrip(b'\x00').rstrip()
last = data.rfind(b'}')
if last > 0: data = data[:last+1]+b'\n'
open('$FILE','wb').write(data)
print('Fixed. Last line:', data.decode('utf-8').strip().split('\n')[-1])
"
else
  echo "OK — file ends correctly with }"
fi
