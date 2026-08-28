import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from './table'

function renderTable() {
  return render(
    <Table>
      <TableCaption>Danh sách sản phẩm</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Giá</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Cà phê</TableCell>
          <TableCell>25.000đ</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Tổng</TableCell>
          <TableCell>25.000đ</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  it('renders as a semantic table element', () => {
    renderTable()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders header cells with column names', () => {
    renderTable()
    expect(screen.getByRole('columnheader', { name: 'Tên' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Giá' })).toBeInTheDocument()
  })

  it('renders body row data', () => {
    renderTable()
    expect(screen.getByRole('cell', { name: 'Cà phê' })).toBeInTheDocument()
  })

  it('renders the caption', () => {
    renderTable()
    expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument()
  })

  it('renders the footer row', () => {
    renderTable()
    expect(screen.getByRole('cell', { name: 'Tổng' })).toBeInTheDocument()
  })

  it('wraps the table in a horizontally scrollable container', () => {
    const { container } = renderTable()
    expect(container.querySelector('div.overflow-x-auto')).toBeInTheDocument()
  })

  it('forwards ref on Table', () => {
    const ref = React.createRef<HTMLTableElement>()
    render(<Table ref={ref} />)
    expect(ref.current?.tagName).toBe('TABLE')
  })

  it('merges custom className on TableRow', () => {
    render(
      <Table>
        <TableBody>
          <TableRow className="custom-row">
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('row')).toHaveClass('custom-row')
  })
})
