import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { ROLES_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"
import { useRolesStore, setIsEditRoleDialogOpen } from "../store"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { useTranslation } from "react-i18next"
import { PermissionCheckbox } from "@/pages/admins/admin-user/components/PermissionDetails"
import { useModels } from "@/pages/admins/admin-user/hooks/usePermissionModels"
import PermissionsTable from "@/components/layout/PermissionsTable"
import { set } from "lodash"

const defaultFormFields = {
  name: "",
}

export default function RoleEditDialog() {
  const { t } = useTranslation()
  const axiosPrivate = useAxiosPrivate()
  const { toast } = useToast()
  const { isEditRoleDialogOpen, selectedRole } = useRolesStore()
  const { mutate, isPending: isSaving } = useMutation("Roles")

  const [role, setRole] = useState(null)
  const [formFields, setFormFields] = useState(defaultFormFields)
  const [permissionsFields, setPermissionsFields] = useState([]) // array of codename strings
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // const { data: permissions, isLoading: isPermissionsLoading } = useModels()
  const [page, setPage] = useState(1);

const { data: permissions, isLoading: isPermissionsLoading } = useModels({ page, search: debouncedSearch });

  const form = useForm({
    defaultValues: defaultFormFields,
  })

  useEffect(() => {
    const fetchRole = async () => {
      if (!selectedRole?.id) return
      setIsLoading(true)
      try {
        const roleRes = await axiosPrivate.get(`${ROLES_URL}/${selectedRole.id}/`)
        setRole(roleRes.data)
        form.setValue("name", roleRes.data.name)
        setFormFields({ name: roleRes.data.name })

        // Track selected permissions as codenames
        setPermissionsFields(roleRes.data.permissions?.results?.map((p) => p.codename) || [])
      } catch (err) {
        console.error(err)
        toast({
          variant: "destructive",
          title: t("Failed to load role"),
          description: err.message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isEditRoleDialogOpen) fetchRole()
  }, [isEditRoleDialogOpen, selectedRole, axiosPrivate, form, t, toast])

  // Extract all unique actions
  const allActions = useMemo(() => {
    return Array.from(new Set(permissions?.results?.map((p) => p.codename.split("_")[0])) || [])
  }, [permissions])

  // Ensure 'view' action comes first
  const actions = useMemo(
    () => (allActions.includes("view") ? ["view", ...allActions.filter((a) => a !== "view")] : allActions),
    [allActions]
  )

  // Group permissions by model
  const groupedPermissions = useMemo(() => {
    if (!permissions) return []
    return permissions?.results?.reduce((acc, permission) => {
      const { model, codename } = permission
      const action = codename.split("_")[0]

      let modelEntry = acc.find((entry) => entry.model === model)
      if (!modelEntry) {
        modelEntry = { model }
        actions.forEach((act) => (modelEntry[act] = null))
        acc.push(modelEntry)
      }

      modelEntry[action] = permission
      return acc
    }, [])
  }, [permissions, actions])

  // Debounced search
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
    return groupedPermissions?.filter((p) => p.model.toLowerCase().includes(debouncedSearch.toLowerCase()))
  }, [debouncedSearch, groupedPermissions])

  // Checkbox change
  const handleCheckboxChange = (permission) => {
    setPermissionsFields((prev) => {
      const exists = prev.includes(permission.codename)
      if (exists) return prev.filter((p) => p !== permission.codename)
      return [...prev, permission.codename]
    })
  }

  const onClose = () => {
    setIsEditRoleDialogOpen(false)
    form.reset()
    setFormFields(defaultFormFields)
    setRole(null)
    setPermissionsFields([])
  }

  const onSubmit = async (values) => {
    if (!values.name?.trim()) {
      toast({
        variant: "destructive",
        title: t("Validation Error"),
        description: t("Role name is required"),
      })
      return
    }

    const formData = {
      name: values.name.trim(),
      permissions: permissionsFields, // send array of codenames
    }

    mutate({
      url: `${ROLES_URL}/`,
      id: selectedRole?.id,
      headers: { "Content-Type": "application/json" },
      onFinish: onClose,
      formData,
    })
  }
  useEffect(() => {
  console.log("Loaded page:", page, "Next:", permissions?.next, "Prev:", permissions?.previous, "permissions selected:", permissionsFields);
}, [permissions, page]);


  return (
    <Dialog open={isEditRoleDialogOpen} 
    onOpenChange={(open) =>{
      if(!open) {onClose()}
      setIsEditRoleDialogOpen(open) 
    }
  }>
      <DialogContent className="w-[95%] sm:max-w-[900px] px-4">
        <ScrollArea className="w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-fit rtl:pr-4 border-none">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>{selectedRole?.id ? t("Edit Role") : t("Create Role")}</DialogTitle>
            <DialogDescription>
              {selectedRole?.id
                ? t("Make changes to role here. Click save when you are done.")
                : t("Create new role here. Click save when you are done.")}
            </DialogDescription>
            {role ? (
                <>
                  {t("Assign or remove permissions for role")}: <strong>({role?.name})</strong>
                  <span className="block text-sm mt-1">
                    {t("Selected")}: {permissionsFields.length} {t("permissions")}
                  </span>
                </>
              ) : (
                t("Loading role details...")
              )}
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: t("Role name is required"),
                  validate: (value) => value?.trim() !== "" || t("Role name cannot be empty"),
                }}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>
                      {t("Role Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("e.g., Manager")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setFormFields((prev) => ({ ...prev, name: e.target.value }))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div className="space-y-2 relative w-full">
                <div className="flex items-center justify-between w-full gap-4 pb-2">
                  <div className="w-3/4 relative">
                    <Input
                      type="text"
                      placeholder={t("Search")}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full"
                    />
                    {loadingSearch && <Loader2 className="animate-spin absolute top-2 right-2 text-blue-500" />}
                  </div>

                  <Button type="submit" disabled={isSaving || !formFields.name} className="w-fit">
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        <span>{t("Please wait")}</span>
                      </div>
                    ) : (
                      t("Save")
                    )}
                  </Button>
                </div>

                {isLoading || isPermissionsLoading ? (
                  <Loader2 className="animate-spin text-blue-500 mx-auto mt-8" size={42} />
                ) : (
                  <ScrollArea className="h-[400px] pb-4 min-w-[250px] w-full">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px] font-semibold">{t("Model")}</TableHead>
                          {actions.map((action) => (
                            <TableHead key={action} className="font-semibold text-center">
                              {t(action)}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredModels?.map((group) => (
                          <TableRow key={group.model}>
                            <TableCell className="font-medium">{group.model}</TableCell>
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
                                          isChecked={permissionsFields.includes(group[action]?.codename)}
                                          onCheckboxChange={handleCheckboxChange}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{group[action]?.codename}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}

                {!filteredModels?.length && !isLoading && (
                  <p className="text-sm text-center py-4">{t("No permissions found.")}</p>
                )}
              </div> */}
              <PermissionsTable selected={permissionsFields} setSelected={setPermissionsFields} showLabel={false}  />
              
        <div className="flex justify-end items-center w-full py-2 space-x-4">
          <Button variant="secondary" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSaving || !selectedRole?.id || isLoading}
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
