import re

file_to_update = 'src/app/components/finance/TreasurerFinanceView.tsx'

with open(file_to_update, 'r') as f:
    content = f.read()

content = content.replace("`Date: {formatCurrencyUSD(dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: $${total)}`,", "`Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: ${formatCurrencyUSD(total)}`,")

content = content.replace("`    Amount: $${item.totalAmount.toFixed(2)}`,", "`    Amount: ${formatCurrencyUSD(item.totalAmount)}`,")
content = content.replace("`Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: $${total.toFixed(2)}`,", "`Date: ${dateStr} | Total Count: ${approvedRequestsForCOOL.length} | Total Sum: ${formatCurrencyUSD(total)}`,")

with open(file_to_update, 'w') as f:
    f.write(content)
