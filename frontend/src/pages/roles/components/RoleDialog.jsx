import { useEffect, useState, useMemo, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import useMutation from "@/hooks/useMutation"
import { useRolesStore, setIsRoleDialogOpen } from "../store"
import { useTranslation } from "react-i18next"
import { PermissionCheckbox } from "@/pages/admins/admin-user/components/PermissionDetails"
import { useModels } from "@/pages/admins/admin-user/hooks/usePermissionModels"
import { ROLES_URL } from "@/utils/constants/urls"
import PermissionsTable from "@/components/layout/PermissionsTable"

const defaultFormFields = { name: "" }

export default function RoleDialog() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { isRoleDialogOpen } = useRolesStore()
  const { mutate, isPending: isSaving } = useMutation("Roles")
  const [formFields, setFormFields] = useState(defaultFormFields)
  const [permissionsFields, setPermissionsFields] = useState([]) // array of codename strings ONLY

  const form = useForm({ defaultValues: defaultFormFields })
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loadingSearch, setLoadingSearch] = useState(false)

  // const { data: permissions, isLoading } = useModels()
  const [page, setPage] = useState(1);

const { data: permissions, isLoading } = useModels({ page, search: debouncedSearch });

  const allActions = useMemo(() => Array.from(new Set(permissions?.results?.map((p) => p.codename.split("_")[0])) || []), [permissions])

    const actions = useMemo(() => (allActions.includes("view") ? ["view", ...allActions.filter((a) => a !== "view")] : allActions), [allActions])

  const groupedPermissions = useMemo(() => {
    if (!permissions) return []
    return permissions?.results?.reduce((acc, permission) => {
      const { model, codename } = permission
      const action = codename.split("_")[0]

      let modelEntry = acc.find((entry) => entry.model === model)

      if (!modelEntry) {
  modelEntry = { 
    model,
    display_name: permission.name || model // Use human-readable permission name
  }
  actions.forEach((act) => (modelEntry[act] = null))
  acc.push(modelEntry)
}


      modelEntry[action] = permission
      return acc
    }, [])
  }, [permissions, actions])

  useEffect(() => {
    setLoadingSearch(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue)
      setLoadingSearch(false)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchValue])

  const filteredModels = useMemo(() => {
    if (!debouncedSearch) return groupedPermissions
    return groupedPermissions.filter((p) => p.model.toLowerCase().includes(debouncedSearch.toLowerCase()))
  }, [debouncedSearch, groupedPermissions])

  const handleCheckboxChange = useCallback((permission) => {
    setPermissionsFields((prev) => {
      // Clean up any objects that might be in the array and ensure we only have strings
      const cleanPrev = prev.filter(item => typeof item === 'string')
      const exists = cleanPrev.includes(permission.codename)
      if (exists) return cleanPrev.filter((p) => p !== permission.codename)
      return [...cleanPrev, permission.codename]
    })
  }, [])

  const onClose = () => {
    setIsRoleDialogOpen(false)
    form.reset()
    setFormFields(defaultFormFields)
    setPermissionsFields([])
  }

  const onSubmit = async (values) => {
    if (!values.name?.trim()) {
      toast({ 
        variant: "destructive", 
        title: t("Validation Error"), 
        description: t("Role name is required") 
      })
      return
    }

    // Clean permissionsFields to ensure it's only strings
    const cleanPermissions = permissionsFields.filter(perm => typeof perm === 'string')

    const formData = {
      name: values.name.trim(),
      permissions: cleanPermissions, // Only array of strings
    }

    console.log("Submitting:", formData) // Debug log

    mutate({
      url: `${ROLES_URL}/`,
      headers: { "Content-Type": "application/json" },
      onFinish: onClose,
      formData,
    })
  }

  useEffect(() => {
  console.log("Loaded page:", page, "Next:", permissions?.next, "Prev:", permissions?.previous, "permissions selected:", permissionsFields);
}, [permissions, page]);


  return (
    <Dialog open={isRoleDialogOpen} 
    onOpenChange={(open)=> {
      if(!open) { onClose();}
      setIsRoleDialogOpen(open)
    }}>
      <DialogContent className="w-[95%] sm:max-w-[900px] px-4">
        <ScrollArea className="w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-fit rtl:pr-4 border-none">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>{t("Create Role")}</DialogTitle>
            <DialogDescription>{t("Create new role here. Click save when you are done.")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: t("Role name is required") }}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span> {t("Role Name")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("e.g., Manager")} onChange={(e) => { field.onChange(e); setFormFields((prev) => ({ ...prev, name: e.target.value })) }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {/* worked permissions with pagination */}
              {/* <div className="space-y-2 relative w-full">
                <div className="flex items-center justify-between w-full gap-4 pb-2">
                  <div className="w-3/4 relative">
                    <Input type="text" placeholder={t("Search")} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full" />
                    {loadingSearch && <Loader2 className="animate-spin absolute top-2 right-2 text-blue-500" />}
                  </div>
                  <Button type="submit" disabled={isSaving || !formFields.name} className="w-fit">
                    {isSaving ? <Loader2 className="animate-spin" /> : t("Save")}
                  </Button>
                </div>

                {isLoading ? (
                  <Loader2 className="animate-spin text-blue-500 mx-auto mt-8" size={42} />
                ) : (
                  <ScrollArea className="h-[400px] pb-4 min-w-[250px] w-full">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px] font-semibold">{t("display_name")}</TableHead>
                          {actions.map((action) => (
                            <TableHead key={action} className="font-semibold text-center">{t(action)}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredModels.map((group) => (
                          <TableRow key={group.model}>
                            <TableCell className="font-medium">{group.display_name}</TableCell>
                            {actions.map((action) => (
                              <TableCell key={action} className="text-center">
                                {group[action] ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <PermissionCheckbox
                                          className="w-fit bg-inherit p-0"
                                          showLabel={false}
                                          model={group[action]}
                                          isChecked={permissionsFields.includes(group[action].codename)}
                                          onCheckboxChange={handleCheckboxChange}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{group[action].codename}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
  <div className="flex items-center justify-between py-2 px-4 w-full">
                          <Pagination
                            next={permissions?.next}
                            previous={permissions?.previous}
                            totalPages={totalPages}
                            totalCount={permissions?.count}
                            page={page}
                            setPage={setPage}
                          />
                        </div>


                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}

                {!filteredModels.length && !isLoading && <p className="text-sm text-center py-4">{t("No permissions found.")}</p>}
              </div> */}
              {/* new permissions table worked */}
              <PermissionsTable selected={permissionsFields} setSelected={setPermissionsFields} showLabel={false}  />
              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={onSubmit}
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? (
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </div>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}