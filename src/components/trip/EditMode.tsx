import { Fragment, useState, type ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TripActivity } from '@/types/chat'

interface EditModeProps {
  activities: TripActivity[]
  onChange: (activities: TripActivity[]) => void
  children: ReactNode
}

/** Dialog for manually adding/removing trip activities and adjusting their price. */
export function EditMode({ activities, onChange, children }: EditModeProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [pendingRemoval, setPendingRemoval] = useState<TripActivity | null>(null)

  function addActivity() {
    const trimmedName = name.trim()
    if (!trimmedName) return

    const activity: TripActivity = {
      id: crypto.randomUUID(),
      name: trimmedName,
      price: price.trim() || null,
    }
    onChange([...activities, activity])
    setName('')
    setPrice('')
  }

  function confirmRemoval() {
    if (!pendingRemoval) return
    onChange(activities.filter((activity) => activity.id !== pendingRemoval.id))
    setPendingRemoval(null)
  }

  function updatePrice(id: string, value: string) {
    onChange(
      activities.map((activity) => (activity.id === id ? { ...activity, price: value.trim() || null } : activity)),
    )
  }

  return (
    <Fragment>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktivitäten bearbeiten</DialogTitle>
            <DialogDescription>Aktivitäten manuell hinzufügen, entfernen oder den Preis anpassen.</DialogDescription>
          </DialogHeader>

          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Aktivitäten hinzugefügt.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activities.map((activity, index) => {
                // Zwei Aktivitäten können denselben frei getippten Namen tragen
                // (addActivity prüft nicht auf Eindeutigkeit) — ohne diese
                // Ergänzung wären ihre aria-labels für Screenreader nicht
                // unterscheidbar (analog Reiseentwuerfe.tsx, 17.09.).
                const hasDuplicates =
                  activities.filter((other) => other.name === activity.name).length > 1
                const occurrence =
                  activities.slice(0, index + 1).filter((other) => other.name === activity.name).length
                const activityLabel = hasDuplicates ? `${activity.name} (Eintrag ${occurrence})` : activity.name
                return (
                  <li key={activity.id} className="flex items-center gap-2">
                    <span className="flex-1 truncate text-sm text-foreground">{activity.name}</span>
                    <Input
                      aria-label={`Preis für ${activityLabel}`}
                      className="w-24"
                      placeholder="Preis"
                      value={activity.price ?? ''}
                      onChange={(event) => updatePrice(activity.id, event.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`${activityLabel} entfernen`}
                      onClick={() => setPendingRemoval(activity)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="flex items-end gap-2 border-t border-border pt-3">
            <div className="flex-1">
              <Label htmlFor="activity-name">Neue Aktivität</Label>
              <Input
                id="activity-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing) addActivity()
                }}
                placeholder="z. B. Stadtführung"
              />
            </div>
            <div className="w-24">
              <Label htmlFor="activity-price">Preis</Label>
              <Input
                id="activity-price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing) addActivity()
                }}
                placeholder="optional"
              />
            </div>
            <Button aria-label="Aktivität hinzufügen" onClick={addActivity} disabled={!name.trim()}>
              <Plus className="size-4" />
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fertig</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktivität entfernen?</DialogTitle>
            <DialogDescription>
              {pendingRemoval?.name} wird aus dieser Reise entfernt. Das lässt sich nicht rückgängig machen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmRemoval}>
              Ja, entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
