import re

files_to_update = [
    'src/app/components/finance/TreasurerFinanceView.tsx',
    'src/app/components/finance/CommitteeFinanceView.tsx',
]

for file in files_to_update:
    with open(file, 'r') as f:
        content = f.read()

    # Needs to add import
    if "import { formatCurrencyUSD } from '@/lib/formatters';" not in content and "import { formatCurrencyUSD" not in content:
        # Find the last import and add it there
        lines = content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        lines.insert(last_import + 1, "import { formatCurrencyUSD } from '@/lib/formatters';")
        content = '\n'.join(lines)

    # Basic replacements
    # ${value.toFixed(2)} -> {formatCurrencyUSD(value)}
    # ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} -> {formatCurrencyUSD(value)}
    # ${value.toLocaleString('en-US')} -> {formatCurrencyUSD(value, { decimals: 0 })}

    # Use lookbehind for literal $ to avoid eating the template string $
    content = re.sub(r'(?<=\>)\$\{(.*?)\.toFixed\(2\)\}', r'{formatCurrencyUSD(\1)}', content)
    content = re.sub(r'(?<=\>)\$\{(.*?)\.toLocaleString\(\'en-US\', \{ minimumFractionDigits: 2 \}\)\}', r'{formatCurrencyUSD(\1)}', content)

    # Specific ones
    content = content.replace("<span>${branchTotals.totalAllocated.toLocaleString('en-US')} base</span>", "<span>{formatCurrencyUSD(branchTotals.totalAllocated, { decimals: 0 })} base</span>")
    content = content.replace("<span className=\"text-emerald-400 font-medium\">+${branchTotals.totalInflows.toLocaleString('en-US')} grants</span>", "<span className=\"text-emerald-400 font-medium\">+{formatCurrencyUSD(branchTotals.totalInflows, { decimals: 0 })} grants</span>")

    content = content.replace("<span>${stats.baseAllocated.toLocaleString('en-US')} base</span>", "<span>{formatCurrencyUSD(stats.baseAllocated, { decimals: 0 })} base</span>")
    content = content.replace("<span className=\"text-emerald-400 font-medium\">+${stats.totalInflows.toLocaleString('en-US')} grants</span>", "<span className=\"text-emerald-400 font-medium\">+{formatCurrencyUSD(stats.totalInflows, { decimals: 0 })} grants</span>")

    # Inflow additions
    content = content.replace("+${inflow.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}", "+{formatCurrencyUSD(inflow.amount)}")
    content = content.replace("+${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}", "+{formatCurrencyUSD(item.amount)}")
    content = content.replace("+${stats.totalInflows.toLocaleString('en-US', { minimumFractionDigits: 2 })} Total Credited", "+{formatCurrencyUSD(stats.totalInflows)} Total Credited")
    content = content.replace("+${c.totalInflows.toLocaleString('en-US', { minimumFractionDigits: 2 })}", "+{formatCurrencyUSD(c.totalInflows)}")


    with open(file, 'w') as f:
        f.write(content)


# ReceiptPreviewModal manually to ensure it's clean
file_to_update = 'src/app/components/finance/ReceiptPreviewModal.tsx'
with open(file_to_update, 'r') as f:
    content = f.read()

content = content.replace("${totalAmount.toFixed(2)}", "{formatCurrencyUSD(totalAmount)}")

if "import { formatCurrencyUSD } from '@/lib/formatters';" not in content:
    lines = content.split('\n')
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
    lines.insert(last_import + 1, "import { formatCurrencyUSD } from '@/lib/formatters';")
    content = '\n'.join(lines)

with open(file_to_update, 'w') as f:
    f.write(content)
