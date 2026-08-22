import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './form';
import { Input } from './input';

function TestForm({ hasError = false }: { hasError?: boolean }) {
  const form = useForm({
    defaultValues: { email: '' },
    errors: hasError ? { email: { type: 'required', message: 'Email is required' } } : {},
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="name@purdue.edu" {...field} />
              </FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form Accessibility & Error Association Suite', () => {
  it('associates input with description when valid', () => {
    render(<TestForm hasError={false} />);
    const input = screen.getByPlaceholderText('name@purdue.edu');

    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('aria-describedby');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toContain('description');
  });

  it('associates input with error message id and aria-invalid when invalid', () => {
    render(<TestForm hasError={true} />);
    const input = screen.getByPlaceholderText('name@purdue.edu');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toContain('message');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
