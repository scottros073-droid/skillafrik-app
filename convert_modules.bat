@echo off
setlocal enabledelayedexpansion

for /r "c:\Users\ADEWALE\skillafrik-app\backend" %%f in (*.js) do (
    if not "%%~dpf"=="c:\Users\ADEWALE\skillafrik-app\backend\node_modules\" (
        if not "%%~dpf"=="c:\Users\ADEWALE\skillafrik-app\backend\coverage\" (
            echo Processing: %%f
            powershell -Command "& {
                $content = Get-Content '%%f' -Raw;
                $content = $content -replace 'import\s+{([^}]+)}\s+from\s+[''\""]([^''\""]+)[''\""]\s*;', 'const {$1} = require(''$2'');';
                $content = $content -replace 'import\s+(\w+)\s+from\s+[''\""]([^''\""]+)[''\""]\s*;', 'const $1 = require(''$2'');';
                $content = $content -replace 'import\s+\*\s+as\s+(\w+)\s+from\s+[''\""]([^''\""]+)[''\""]\s*;', 'const $1 = require(''$2'');';
                $content = $content -replace 'export\s+default\s+(\w+)\s*;', 'module.exports = $1;';
                $content = $content -replace 'export\s+const\s+(\w+)\s*=', 'const $1 =';
                $content = $content -replace 'export\s+function\s+(\w+)', 'function $1';
                $content = $content -replace 'export\s+{([^}]+)}\s*;', 'module.exports = {$1};';
                Set-Content '%%f' $content;
            }"
        )
    )
)

echo Conversion complete!