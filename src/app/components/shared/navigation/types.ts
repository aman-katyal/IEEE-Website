export interface NavDropdownItem {
  label: string;
  href: string;
  id?: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}
