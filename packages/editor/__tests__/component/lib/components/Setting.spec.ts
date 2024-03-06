import {render, screen, within} from '@testing-library/svelte'
import { it, expect, describe } from 'vitest';
import SettingTest from './Setting.test.svelte';

let host: HTMLElement

describe('Test slot fallbacks', () => {
  it('Test Setting component slot', () => {
    render(SettingTest);
    
    const setting = screen.getByRole('setting')
    const child = within(setting).getByTestId('child')
    
    expect(child).toBeInTheDocument();
  });
});