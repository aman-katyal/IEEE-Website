import { MessageCircle, CreditCard, Users, CheckCircle2, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useSiteSettings } from "../../hooks/useSanityData";

export function JoinPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultDuesBenefits = [
    "Access to industry networks and exclusive company info sessions",
    "Trip expense coverage for committee competitions and social events",
    "Free food at General Assemblies",
    "Recognition for contributed work with final projects",
  ];

  const duesBenefits = settings?.duesBenefits || defaultDuesBenefits;
  const discordUrl = settings?.discordUrl || "https://discord.gg/sPPQequ9ws";
  const paymentUrl = settings?.paymentUrl || "https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx";
  const duesDescription = settings?.duesDescription || "Purdue IEEE Student Branch requires payment of dues for membership. To pay, follow the link below and search for \"IEEE\" in the catalog search box. Payment gives access to:";
  const defaultOptions = [
    { name: "Standard Membership", subtitle: "Local dues only", price: "$10" },
    { name: "Membership + Shirt", subtitle: "Support the branch & gear up", price: "$15" }
  ];
  const duesOptions = settings?.duesOptions || defaultOptions;

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-[var(--boiler-black)] text-[var(--text-primary)]">Loading...</div>;
  }

  return (
    <section className="bg-[var(--boiler-black)] min-h-screen pt-[120px] pb-24 relative overflow-hidden">
      {/* Background grid */}
      <div
        className={`ieee-grid-bg absolute inset-0 ${isLight ? "opacity-40" : "opacity-25"}`}
      />

      <div className="relative z-5 max-w-[1000px] mx-auto px-8">
        {/* Header */}
        <div className="mb-[72px] text-center">
          <p className={`section-eyebrow mb-4 ${isLight ? "opacity-100" : "opacity-90"}`}>
            // Get Started
          </p>
          <h2 className="font-[family-name:var(--font-headline)] text-[clamp(32px,5vw,56px)] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.03em] mb-6">
            Joining Purdue IEEE is <span className="text-[var(--electric-blue)]">easier than ever!</span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-lg text-[var(--text-secondary)] leading-[1.6] max-w-[700px] mx-auto">
            To join, simply attend any committee meeting and pay dues.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Quick Steps */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-5">
                <Users size={24} className="text-[var(--electric-blue)]" />
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-semibold text-[var(--text-primary)]">Attend Meetings</h3>
              </div>
              <p className="font-[family-name:var(--font-body)] text-[15px] text-[var(--text-secondary)] leading-[1.6]">
                Check out our list of committees and find one that interests you. You're welcome to attend any meeting to see what we're about.
              </p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-5">
                <CreditCard size={24} className="text-[var(--cyber-gold)]" />
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-semibold text-[var(--text-primary)]">Pay Dues</h3>
              </div>
              <p className="font-[family-name:var(--font-body)] text-[15px] text-[var(--text-secondary)] leading-[1.6]">
                Official membership requires small annual dues, which fund our projects, competitions, and events.
              </p>
            </div>
          </div>

          {/* Connect Section */}
          <div className={`glass-card p-[clamp(24px,5vw,48px)] ${isLight ? "bg-[#5865F214] border-[#5865F24D]" : "bg-[#5865F20D] border-[#5865F233]"}`}>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex-1 min-w-[260px]">
                <h3 className="font-[family-name:var(--font-headline)] text-[28px] font-semibold text-[var(--text-primary)] mb-4">Connect with us</h3>
                <p className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] leading-[1.6] mb-6">
                  Join Purdue IEEE today and start connecting with fellow members on Discord. Stay engaged with all committee updates and event announcements.
                </p>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2.5 no-underline bg-[#5865F2] border-[#5865F2] hover:bg-[#4752C4] hover:border-[#4752C4]"
                >
                  <MessageCircle size={18} />
                  Join Discord
                </a>
              </div>
              <div className="w-[120px] h-[120px] bg-[#5865F21A] rounded-3xl hidden sm:flex items-center justify-center">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="#5865F2" className="m-auto">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                 </svg>
              </div>
            </div>
          </div>

          {/* Dues Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-px bg-[var(--cyber-gold)]" />
              <h3 className="font-[family-name:var(--font-headline)] text-[32px] font-bold text-[var(--text-primary)]">Dues</h3>
            </div>

            <div className="ieee-grid-2 gap-8">
              <div>
                <div className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] leading-[1.7] mb-6 whitespace-pre-wrap">
                  {duesDescription}
                </div>
                <div className="flex flex-col gap-4">
                  {duesBenefits.map((benefit) => (
                    <div key={benefit} className="flex gap-3 items-start">
                      <CheckCircle2 size={18} className="text-[var(--electric-blue)] shrink-0 mt-0.5" />
                      <span className="font-[family-name:var(--font-body)] text-[15px] text-[var(--text-primary)]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`glass-card p-[clamp(24px,5vw,40px)] ${isLight ? "bg-[rgba(0,90,135,0.05)]" : "bg-[rgba(0,98,155,0.05)]"}`}>
                <h4 className={`font-[family-name:var(--font-headline)] text-lg font-semibold text-[var(--cyber-gold)] mb-5 uppercase tracking-[0.1em] ${isLight ? "opacity-100" : "opacity-90"}`}>
                  2025-26 Options
                </h4>
                <div className="flex flex-col gap-6 mb-8">
                  {duesOptions.map((option, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4">
                      <div>
                        <span className="block text-[var(--text-primary)] font-semibold">{option.name}</span>
                        <span className={`text-xs text-[var(--text-muted)] ${isLight ? "opacity-100" : "opacity-80"}`}>{option.subtitle}</span>
                      </div>
                      <span className="text-2xl font-bold text-[var(--electric-blue)]">{option.price}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full text-center flex items-center justify-center gap-2 no-underline"
                >
                  Pay via TooCool
                  <ExternalLink size={14} />
                </a>
                
                <p className={`mt-3 text-xs text-[var(--electric-blue)] text-center font-[family-name:var(--font-mono)] ${isLight ? "font-semibold" : "font-normal"}`}>
                  Search for "IEEE" in the search box on TooCool
                </p>
                
                <p className={`mt-6 text-[13px] text-[var(--text-muted)] italic leading-relaxed ${isLight ? "opacity-100" : "opacity-80"}`}>
                  * If you have an active International IEEE Membership, you are exempt from local dues! Contact an officer to complete registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
