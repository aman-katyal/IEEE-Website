export interface NavDropdownItem {
  label: string;
  href: string;
  id?: string;
  dividerBefore?: boolean;
}

export interface NavLinkItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}
