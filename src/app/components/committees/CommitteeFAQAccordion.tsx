import { useState, useMemo } from "react";
import { Search, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface CommitteeFAQAccordionProps {
  items: FAQItem[];
}

export function CommitteeFAQAccordion({ items }: CommitteeFAQAccordionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ["ALL", ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/80 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category Filter Badges */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="radiogroup" aria-label="Filter by FAQ category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-black"
                    : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-neutral-400 text-sm">
          No FAQs match your search or filter criteria.
        </div>
      ) : (
        <Accordion type="multiple" className="w-full space-y-2">
          {filteredItems.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-white/10 rounded-lg px-4 bg-neutral-900/40 backdrop-blur-sm"
            >
              <AccordionTrigger className="text-sm font-semibold text-white hover:text-primary transition-colors py-3">
                <div className="flex items-center gap-2 text-left">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-neutral-300 leading-relaxed pt-1 pb-3 pl-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
