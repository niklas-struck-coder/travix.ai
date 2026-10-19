import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

describe('Tabs', () => {
  it('setzt data-slot="tabs" und data-orientation="horizontal", wenn orientation nicht übergeben wird', () => {
    render(
      <Tabs defaultValue="a" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    const tabs = screen.getByTestId('tabs')
    expect(tabs.dataset.slot).toBe('tabs')
    expect(tabs.dataset.orientation).toBe('horizontal')
  })

  it('übernimmt eine explizit übergebene orientation in data-orientation', () => {
    render(
      <Tabs defaultValue="a" orientation="vertical" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('tabs').dataset.orientation).toBe('vertical')
  })

  it('merged ein eigenes className mit den generierten Klassen', () => {
    render(
      <Tabs defaultValue="a" className="mt-4" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('tabs').className).toContain('mt-4')
  })
})

describe('TabsList', () => {
  it('setzt data-slot="tabs-list" und data-variant="default", wenn variant nicht übergeben wird', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList data-testid="list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    const list = screen.getByTestId('list')
    expect(list.dataset.slot).toBe('tabs-list')
    expect(list.dataset.variant).toBe('default')
  })

  it('übernimmt eine explizit übergebene variant in data-variant', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="line" data-testid="list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('list').dataset.variant).toBe('line')
  })

  it('merged ein eigenes className mit den generierten Klassen', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList className="mt-4" data-testid="list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(screen.getByTestId('list').className).toContain('mt-4')
  })
})

describe('TabsTrigger', () => {
  it('setzt data-slot="tabs-trigger" und merged ein eigenes className', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" className="mt-4">
            A
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
    const trigger = screen.getByText('A')
    expect(trigger.dataset.slot).toBe('tabs-trigger')
    expect(trigger.className).toContain('mt-4')
  })
})

describe('TabsContent', () => {
  it('setzt data-slot="tabs-content" und merged ein eigenes className', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="mt-4">
          Inhalt
        </TabsContent>
      </Tabs>
    )
    const content = screen.getByText('Inhalt')
    expect(content.dataset.slot).toBe('tabs-content')
    expect(content.className).toContain('mt-4')
  })
})
