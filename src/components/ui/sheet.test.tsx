import { useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet'

// Mirrors dialog.test.tsx's RemovableListHarness: a per-card trigger opens
// the sheet, and confirming removes the card (and its trigger) from the DOM.
function RemovableListHarness() {
  const [items, setItems] = useState(['Eins', 'Zwei'])
  const [pending, setPending] = useState<string | null>(null)

  return (
    <div>
      <h1>Testseite</h1>
      <ul>
        {items.map((item) => (
          <li key={item}>
            {item}
            <Button onClick={() => setPending(item)}>{item} entfernen</Button>
          </li>
        ))}
      </ul>
      <Sheet open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Entfernen?</SheetTitle>
          </SheetHeader>
          <Button
            variant="destructive"
            onClick={() => {
              setItems((current) => current.filter((entry) => entry !== pending))
              setPending(null)
            }}
          >
            Ja, entfernen
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}

describe('SheetContent close-focus fallback', () => {
  it('moves focus to the page heading when confirming removes the element that opened the sheet', async () => {
    render(<RemovableListHarness />)

    const trigger = screen.getByRole('button', { name: 'Eins entfernen' })
    trigger.focus()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Testseite' }))
    })
  })

  it('still returns focus to the trigger on cancel, where it still exists', async () => {
    render(<RemovableListHarness />)

    const trigger = screen.getByRole('button', { name: 'Eins entfernen' })
    trigger.focus()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }))

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger)
    })
  })
})
