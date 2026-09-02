import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './file-upload'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  render: () => {
    function Demo() {
      const [files, setFiles] = useState<File[]>([])
      return (
        <FileUpload
          label="Attachment"
          helperText="Any file type, no size limit"
          value={files}
          onFilesChange={setFiles}
        />
      )
    }
    return <Demo />
  },
}

export const RestrictedType: Story = {
  render: () => {
    function Demo() {
      const [files, setFiles] = useState<File[]>([])
      return (
        <FileUpload
          label="Spreadsheet"
          accept=".xlsx,.xls,.csv"
          maxSize={5 * 1024 * 1024}
          value={files}
          onFilesChange={setFiles}
        />
      )
    }
    return <Demo />
  },
}

export const Multiple: Story = {
  render: () => {
    function Demo() {
      const [files, setFiles] = useState<File[]>([])
      return (
        <FileUpload
          label="Attachments"
          multiple
          maxSize={10 * 1024 * 1024}
          value={files}
          onFilesChange={setFiles}
        />
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  args: {
    label: 'Attachment',
    disabled: true,
  },
}
