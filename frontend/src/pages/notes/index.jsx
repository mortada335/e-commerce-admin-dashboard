import Section from "@/components/layout/Section"
import DataTable from "@/components/ui/DataTable"
import DataTableSkeleton from "@/components/data-table/data-table-skeleton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import WrapperComponent from "@/components/layout/WrapperComponent"
import HeaderText from "@/components/layout/header-text"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import Pagination from "@/components/layout/Pagination"
import columns from "./components/columns"
import { NOTES_URL } from "@/utils/constants/urls"

import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import {
  setIsNoteDialogOpen,
  setSelectedNote,
  useNoteStore,
  setIsDeleteNoteDialogOpen,
} from "./store"
import qs from "qs"
import NoteDialog from "./components/NoteDialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { displayBasicDate } from "@/utils/methods"
const Notes = () => {
  const { sortBy, sortType } = useNoteStore()
  const axiosPrivate = useAxiosPrivate()
  const { isDeleteNoteDialogOpen, selectedNote } = useNoteStore()
  const [itemPerPage, setItemPerPage] = useState("25")
  const [page, setPage] = useState(1)

  const GetAdminNotes = async (page) => {
    let searchKeyObject = {}
    searchKeyObject = Object.fromEntries(
      Object.entries({
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    )
    return axiosPrivate.get(
      `${NOTES_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    )
  }

  const {
    data: notes,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Notes", page, itemPerPage, sortBy, sortType],
    queryFn: () => GetAdminNotes(page),
  })
  const totalPages = Math.ceil(Notes?.data?.count / itemPerPage) // Assuming 25 items per page

  const handleAddNote = () => {
    setSelectedNote(null)
    setIsNoteDialogOpen(true)
  }

  return (
    <Section className="space-y-8 h-fit items-start">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Notes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderText className={"w-full text-start "} text={"Notes"} />

      <Card className="flex justify-between items-center w-full px-2  py-2">
        <Button onClick={handleAddNote}>Add New Note</Button>
        <Select onValueChange={setItemPerPage} defaultValue={itemPerPage}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select item per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Item per page</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Card>

      <WrapperComponent
        isEmpty={!notes?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage="You don't have any notes get started by creating a new one."
      >
        <DataTable
          columns={columns}
          data={notes?.data?.results?.map((note) => ({
            id: note.important_notes_id,
            title: note.important_notes_title,
            type: note.important_notes_type,
            status: note.important_notes_status,
            language: note.language_id,
            bgColor: note.important_notes_bkcolor,
            color: note.important_notes_title_color,
            icon: note.important_notes_icon,
            category_name: note.category_name,
            category_id: note.category_id,
            dateAdded: note.date_added ? displayBasicDate(note.date_added) : "",
            dateModified: note.date_modified
              ? displayBasicDate(note.date_modified)
              : "",
            actions: note.important_notes_id,
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={notes?.data?.next}
            previous={notes?.data?.previous}
            totalPages={totalPages ? totalPages : 1}
            totalCount={notes?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
      <NoteDialog />

      <OnDeleteDialog
        name={"Notes"}
        heading={"Are you absolutely sure?"}
        description={`This action cannot be undone. This will permanently delete this  "${selectedNote?.title}".`}
        url={NOTES_URL}
        id={selectedNote?.id}
        isDialogOpen={isDeleteNoteDialogOpen}
        setIsDialogOpen={setIsDeleteNoteDialogOpen}
      />
    </Section>
  )
}

export default Notes
