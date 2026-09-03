export { Button, buttonVariants, type ButtonProps } from './components/button'
export { ButtonGroup, type ButtonGroupProps } from './components/button-group'
export { TreeItem, type TreeItemProps } from './components/tree-item'
export { BarChart, type BarChartDatum, type BarChartProps } from './components/bar-chart'
export {
  FileUpload,
  type FileUploadProps,
  type FileRejection,
  type FileRejectionReason,
} from './components/file-upload'
export { IconButton, type IconButtonProps } from './components/icon-button'
export { Label, type LabelProps } from './components/label'
export { Textarea, type TextareaProps } from './components/textarea'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './components/card'
export { Badge, badgeVariants, type BadgeProps } from './components/badge'
export { Tag, tagVariants, type TagProps } from './components/tag'
export { Separator, type SeparatorProps } from './components/separator'
export { Skeleton, type SkeletonProps } from './components/skeleton'
export { Form, type FormProps } from './components/form'
export { FormField, type FormFieldProps } from './components/form'
export { patterns } from './lib/validators'
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog'
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  type SheetContentProps,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/sheet'
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
} from './components/table'
export { NumberInput, type NumberInputProps } from './components/number-input'
export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  type AlertProps,
  type AlertTitleProps,
  type AlertDescriptionProps,
} from './components/alert'
export { Progress, type ProgressProps } from './components/progress'
export { Spinner, type SpinnerProps } from './components/spinner'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs'
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './components/dropdown-menu'
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from './components/popover'
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components/tooltip'
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  type BreadcrumbProps,
  type BreadcrumbListProps,
  type BreadcrumbItemProps,
  type BreadcrumbLinkProps,
  type BreadcrumbPageProps,
  type BreadcrumbSeparatorProps,
} from './components/breadcrumb'
export {
  Stepper,
  StepperGroup,
  StepperItem,
  StepperConnector,
  stepperItemVariants,
  type StepperProps,
  type StepperGroupProps,
  type StepperItemProps,
  type StepperConnectorProps,
} from './components/stepper'
export { Pagination, type PaginationProps } from './components/pagination'
export { Avatar, type AvatarProps } from './components/avatar'
export { Chip, chipVariants, type ChipProps } from './components/chip'
export { TagsInput, type TagsInputProps } from './components/tags-input'
export { SuggestInput, type SuggestInputProps } from './components/suggest-input'
export { Input, type InputProps } from './components/input'
export { Checkbox, type CheckboxProps } from './components/checkbox'
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './components/radio-group'
export { Toggle, type ToggleProps } from './components/toggle'
// Aliases matching the standard shadcn/ui naming (docs/component-status.md's "Cần cải thiện" note
// for Toggle/Autocomplete) — kept alongside the original names rather than renaming, so existing
// call sites don't break.
export { Toggle as Switch, type ToggleProps as SwitchProps } from './components/toggle'
export { Select, type SelectOption, type SelectProps } from './components/select'
export {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps,
} from './components/multi-select'
export { toast, ToastProvider, type ToastVariant, type ToastEntry } from './components/toast'
export {
  Autocomplete,
  type AutocompleteOption,
  type AutocompleteProps,
} from './components/autocomplete'
export {
  Autocomplete as Combobox,
  type AutocompleteOption as ComboboxOption,
  type AutocompleteProps as ComboboxProps,
} from './components/autocomplete'
export { DatePicker, type DatePickerProps } from './components/date-picker'
export { DateTimePicker, type DateTimePickerProps } from './components/date-time-picker'
export {
  DateRangePicker,
  type DateRange,
  type DateRangePickerProps,
} from './components/date-range-picker'
