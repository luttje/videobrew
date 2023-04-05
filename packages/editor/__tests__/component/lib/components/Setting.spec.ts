import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import Setting from '../../../../src/lib/components/Setting.svelte';

describe('Test slot fallbacks', () => {
  it('Put some elements', () => {
    render(html`<${Setting}>My Configuration</${Setting}>`);
    expect(screen.getByText('My Configuration:')).toBeInTheDocument();
  });
});