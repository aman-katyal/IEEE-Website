import re

file_to_update = 'src/app/components/finance/ReceiptPreviewModal.tsx'

with open(file_to_update, 'r') as f:
    lines = f.readlines()

# Find the first empty line or first component declaration and add import before it
new_lines = []
for line in lines:
    if line.strip() == "import { formatCurrencyUSD } from '@/lib/formatters';":
        continue
    new_lines.append(line)

new_lines.insert(1, "import { formatCurrencyUSD } from '@/lib/formatters';\n")

with open(file_to_update, 'w') as f:
    f.writelines(new_lines)
