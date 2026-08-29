import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import {
  Download,
  Copy,
  Check,
  Search,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Landmark,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  type BosoAccountStatement,
  type BosoStatementItem,
  OFFICIAL_BOSO_STATEMENT_SFAB_2026,
} from "./financeData";

interface BosoCoolStatementViewProps {
  statement?: BosoAccountStatement;
}

export function BosoCoolStatementView({
  statement = OFFICIAL_BOSO_STATEMENT_SFAB_2026,
}: BosoCoolStatementViewProps) {
  const [activeCategory, setActiveCategory] = useState<
    "ALL" | "PAYMENT" | "CREDIT" | "DEBIT" | "TRANSFER_OUT"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  // Combine all items with chronological and category metadata
  const allItems: BosoStatementItem[] = useMemo(() => {
    return [
      ...statement.payments,
      ...statement.credits,
      ...statement.debits,
      ...statement.transfersOut,
    ];
  }, [statement]);

  // Filtered item list
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory =
        activeCategory === "ALL" || item.type === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.date.toLowerCase().includes(q) ||
        item.docOrCheckNumber.toLowerCase().includes(q) ||
        item.refCode.toLowerCase().includes(q) ||
        (item.refNumber && item.refNumber.toLowerCase().includes(q)) ||
        item.expenseOrIncomeCode.toLowerCase().includes(q) ||
        (item.payeeOrVendor && item.payeeOrVendor.toLowerCase().includes(q)) ||
        item.amount.toFixed(2).includes(q)
      );
    });
  }, [allItems, activeCategory, searchQuery]);

  const handleCopySummary = () => {
    const text = `PURDUE UNIVERSITY BOSO ACCOUNT STATEMENT
Account: ${statement.accountName} (SOA #${statement.soaNumber})
Period: ${statement.statementPeriod}
Office: ${statement.department} - ${statement.officeLocation}

Beginning Balance: $${statement.beginningBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
- Payments:        $${statement.totalPayments.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${statement.payments.length} items)
+ Credits:         $${statement.totalCredits.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${statement.credits.length} items)
- Debits:          $${statement.totalDebits.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${statement.debits.length} items)
- Transfers Out:   $${statement.totalTransfersOut.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${statement.transfersOut.length} items)
----------------------------------------
Ending Balance:    $${statement.endingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} [RECONCILED / ZERO BALANCE]`;

    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Category",
      "Date",
      "Doc/Check #",
      "Ref Code",
      "Ref #",
      "Amount",
      "Cleared Date",
      "Expense/Income Code",
      "Payee/Vendor",
    ];

    const rows = allItems.map((item) => [
      item.type,
      item.date,
      item.docOrCheckNumber,
      `"${item.refCode}"`,
      `"${item.refNumber || ""}"`,
      item.amount.toFixed(2),
      item.clearedDate,
      `"${item.expenseOrIncomeCode}"`,
      `"${item.payeeOrVendor || ""}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BOSO_Statement_SOA_${statement.soaNumber}_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" aria-label="BOSO COOL Statement Section">
      {/* Top Banner Card: Account Identity & BOSO Verification */}
      <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-amber-950/20 p-6 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono px-2.5 py-0.5">
                SOA #{statement.soaNumber}
              </Badge>
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono px-2.5 py-0.5">
                Official BOSO Statement
              </Badge>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Settled & Reconciled
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              {statement.accountName}
            </h2>

            <p className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>📅 Period: {statement.statementPeriod}</span>
              <span>📍 {statement.department}</span>
              <span>🏢 {statement.officeLocation}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Ledger</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Statement Summary</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadCsv}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Statement CSV</span>
            </Button>

            <a
              href={statement.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Visit Purdue BOSO Website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-5 bg-[#0a0a0c]">
          {/* Beginning Balance */}
          <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase">
              <span>Beginning Balance</span>
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
              $
              {statement.beginningBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              As of 06/01/2026
            </p>
          </div>

          {/* Debits */}
          <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/30">
            <div className="flex items-center justify-between text-rose-400 text-[11px] font-mono uppercase">
              <span>Total Debits</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-rose-400 mt-1">
              -$
              {statement.totalDebits.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-rose-400/70 mt-0.5">
              {statement.debits.length} Invoices / Orders
            </p>
          </div>

          {/* Payments */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
            <div className="flex items-center justify-between text-amber-400 text-[11px] font-mono uppercase">
              <span>Total Payments</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
              -$
              {statement.totalPayments.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-amber-400/70 mt-0.5">
              {statement.payments.length} Checks & E-Pays
            </p>
          </div>

          {/* Credits */}
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center justify-between text-emerald-400 text-[11px] font-mono uppercase">
              <span>Total Credits</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
              +$
              {statement.totalCredits.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-emerald-400/70 mt-0.5">
              {statement.credits.length} Refunds & Voids
            </p>
          </div>

          {/* Transfers Out */}
          <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-900/30">
            <div className="flex items-center justify-between text-purple-400 text-[11px] font-mono uppercase">
              <span>Transfers Out</span>
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-1">
              -$
              {statement.totalTransfersOut.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-purple-400/70 mt-0.5">
              Year-End SFAB Sweep
            </p>
          </div>

          {/* Ending Balance */}
          <div className="p-3.5 rounded-lg bg-sky-950/20 border border-sky-900/30">
            <div className="flex items-center justify-between text-sky-400 text-[11px] font-mono uppercase">
              <span>Ending Balance</span>
              <Check className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
              $
              {statement.endingBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[10px] text-sky-400/70 mt-0.5">
              100% Fully Closed Out
            </p>
          </div>
        </div>
      </Card>

      {/* Main Ledger Table Card */}
      <Card className="bg-[#121214] border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>BOSO Transaction Ledger & Voucher History</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Detailed itemization from Purdue University Business Office for
              Student Organizations (KRCH 365).
            </CardDescription>
          </div>

          {/* Search and Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, check #, code..."
                className="pl-9 h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div
              className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700"
              role="group"
              aria-label="Filter transactions by category"
            >
              <button
                type="button"
                onClick={() => setActiveCategory("ALL")}
                aria-pressed={activeCategory === "ALL"}
                aria-label="Show all transactions"
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === "ALL"
                    ? "bg-sky-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({allItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("PAYMENT")}
                aria-pressed={activeCategory === "PAYMENT"}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === "PAYMENT"
                    ? "bg-amber-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Payments ({statement.payments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("CREDIT")}
                aria-pressed={activeCategory === "CREDIT"}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === "CREDIT"
                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Credits ({statement.credits.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("DEBIT")}
                aria-pressed={activeCategory === "DEBIT"}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === "DEBIT"
                    ? "bg-rose-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Debits ({statement.debits.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("TRANSFER_OUT")}
                aria-pressed={activeCategory === "TRANSFER_OUT"}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeCategory === "TRANSFER_OUT"
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Transfers ({statement.transfersOut.length})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/60 border-b border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pl-6">
                  Type
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                  Date
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                  Check / Doc #
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                  Ref Code / Vendor
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3">
                  Ref #
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-right">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 text-center">
                  Cleared
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-slate-400 py-3 pr-6">
                  Expense Code / Payee
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isPayment = item.type === "PAYMENT";
                  const isCredit = item.type === "CREDIT";
                  const isDebit = item.type === "DEBIT";
                  const isTransfer = item.type === "TRANSFER_OUT";

                  return (
                    <TableRow
                      key={item.id}
                      className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Type Badge */}
                      <TableCell className="pl-6 py-3.5">
                        {isPayment && (
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-mono">
                            Payment
                          </Badge>
                        )}
                        {isCredit && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                            Credit
                          </Badge>
                        )}
                        {isDebit && (
                          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px] font-mono">
                            Debit
                          </Badge>
                        )}
                        {isTransfer && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] font-mono">
                            Transfer Out
                          </Badge>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="font-mono text-xs text-slate-300 py-3.5">
                        {item.date}
                      </TableCell>

                      {/* Check / Doc Number */}
                      <TableCell className="font-mono text-xs text-slate-200 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {item.docOrCheckNumber}
                        </span>
                      </TableCell>

                      {/* Ref Code / Payee */}
                      <TableCell className="text-xs font-medium text-white py-3.5">
                        <div className="flex flex-col">
                          <span>{item.refCode}</span>
                          {item.payeeOrVendor && (
                            <span className="text-[11px] text-slate-400 font-normal">
                              {item.payeeOrVendor}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Ref # */}
                      <TableCell className="font-mono text-xs text-slate-400 py-3.5">
                        {item.refNumber || "—"}
                      </TableCell>

                      {/* Amount */}
                      <TableCell
                        className={`text-right font-mono text-xs font-bold py-3.5 ${
                          isCredit
                            ? "text-emerald-400"
                            : isDebit
                              ? "text-rose-400"
                              : isPayment
                                ? "text-amber-400"
                                : "text-purple-400"
                        }`}
                      >
                        {isCredit ? "+" : "-"}${item.amount.toFixed(2)}
                      </TableCell>

                      {/* Cleared Date */}
                      <TableCell className="text-center font-mono text-[11px] text-slate-400 py-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-400/90">
                          <Check className="w-3 h-3" />
                          {item.clearedDate}
                        </span>
                      </TableCell>

                      {/* Expense Code */}
                      <TableCell className="text-xs text-slate-300 pr-6 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
                          {item.expenseOrIncomeCode}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-slate-500"
                  >
                    No transactions matching the selected filter or search
                    query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reconciliation Math Explanation Callout */}
      <Card className="bg-slate-900/40 border-slate-800 p-5">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-400">
            <h4 className="font-semibold text-white">
              BOSO Statement Reconciliation Formula
            </h4>
            <p className="font-mono text-[11px] text-slate-300 leading-relaxed">
              Beginning Balance ($11,390.55) - Payments ($1,062.77) + Credits
              ($563.13) - Debits ($10,145.53) - Transfers Out ($745.38) = Ending
              Balance ($0.00)
            </p>
            <p className="text-[11px] text-slate-400">
              Note: Void check E316419 ($304.61 + $255.53 = $560.14) was
              credited back on 06/23/26 and reissued as check E331903 on
              06/26/26. Unused SFAB funds ($745.38) were transferred out during
              year-end closeout.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
