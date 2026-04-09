import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { useModels } from "@/pages/admins/admin-user/hooks/usePermissionModels"
import useMutation from "@/hooks/useMutation"
import { ROLES_URL } from "@/utils/constants/urls"
import { PermissionCheckbox } from "@/pages/admins/admin-user/components/PermissionDetails"
import { useRolesStore, setIsAssignRoleDialogOpen } from "../store"
import Pagination from "@/components/layout/Pagination"
import PermissionsTable from "@/components/layout/PermissionsTable"

export default function AssignPermissionToRole() {
  const { t } = useTranslation()
  const axiosPrivate = useAxiosPrivate()
  const { toast } = useToast()
  const { isAssignRoleDialogOpen, selectedRole } = useRolesStore()
  const { mutate, isPending: isSaving } = useMutation("Roles")

  const [role, setRole] = useState(null)
  const [permissionsFields, setPermissionsFields] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Pagination state
  const [page, setPage] = useState(1)
 

  const { data: permissions, isLoading: isPermissionsLoading } = useModels(page, debouncedSearch)

  // Fetch role details (including assigned permissions)
  useEffect(() => {
    const fetchRole = async () => {
      if (!selectedRole?.id) return
      setIsLoading(true)
      try {
        const res = await axiosPrivate.get(`${ROLES_URL}/${selectedRole.id}/`)
        setRole(res.data)
        
        const rolePermissions = res.data.permissions?.results 
          ? res.data.permissions.results.map((p) => p.codename)
          : res.data.permissions?.map((p) => p.codename) || []
        
        setPermissionsFields(rolePermissions)
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

    if (isAssignRoleDialogOpen) {
      fetchRole()
    } else {
      setRole(null)
      setPermissionsFields([])
      setSearchValue("")
      setDebouncedSearch("")
      setPage(1)
    }
  }, [isAssignRoleDialogOpen, selectedRole?.id, axiosPrivate, toast, t])

  // Actions extraction
  const allActions = useMemo(() => {
    return Array.from(new Set(permissions?.results?.map((p) => p.codename.split("_")[0])) || [])
  }, [permissions])

  const actions = useMemo(
    () => (allActions.includes("view") ? ["view", ...allActions.filter((a) => a !== "view")] : allActions),
    [allActions]
  )

  const groupedPermissions = useMemo(() => {
    if (!permissions?.results) return [];

    return permissions?.results?.reduce((acc, permission) => {
      const { model, codename } = permission
      const action = codename.split("_")[0]

      let modelEntry = acc.find((entry) => entry.model === model)
      if (!modelEntry) {
        modelEntry = { 
          model,
          display_name: permission.name || model // Human-readable name
        }
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
      setPage(1) // Reset to first page on new search
    }, 300)
    return () => clearTimeout(handler)
  }, [searchValue])

  const filteredModels = useMemo(() => {
    if (!debouncedSearch) return groupedPermissions
    return groupedPermissions?.filter((p) => 
      p.model.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.display_name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
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
    setIsAssignRoleDialogOpen(false)
    setRole(null)
    setPermissionsFields([])
    setPage(1)
  }

  const onSave = async () => {
    const formData = {
      name: selectedRole?.name,
      permissions: permissionsFields
    }
    mutate({
      url: `${ROLES_URL}/`,
      id: selectedRole?.id,
      headers: { "Content-Type": "application/json" },
      formData,
      onFinish: onClose,
    })
  }

  return (
    <Dialog inert open={isAssignRoleDialogOpen} 
    onOpenChange={(open)=>{
      if(!open) {onClose()}
      setIsAssignRoleDialogOpen(open)
    }}>
      <DialogContent className="w-[95%] sm:max-w-[900px] px-4">
        <ScrollArea className="w-full h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-fit rtl:pr-4">
          <DialogHeader className="rtl:items-end mb-2 space-y-2">
            <DialogTitle>{t("Assign Permissions to Role")}</DialogTitle>
            <DialogDescription>
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
            </DialogDescription>
          </DialogHeader>

          {/* <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between gap-4">
              <div className="w-3/4 relative">
                <Input
                  type="text"
                  placeholder={t("Search Models")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full"
                />
                {loadingSearch && <Loader2 className="animate-spin absolute top-2 right-2 text-blue-500" />}
              </div>

              <Button onClick={onSave} disabled={isSaving || isLoading} className="w-fit">
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>{t("Saving...")}</span>
                  </div>
                ) : (
                  t("Save")
                )}
              </Button>
            </div>

            {isLoading || isPermissionsLoading ? (
              <Loader2 className="animate-spin text-blue-500 mx-auto mt-8" size={42} />
            ) : (
              <>
                <ScrollArea className="h-[400px] pb-4 min-w-[250px] w-full border rounded-lg">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] font-semibold">{t("display_name")}</TableHead>
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
              </>
            )}

            {!filteredModels?.length && !isLoading && !isPermissionsLoading && (
              <p className="text-sm text-center py-4">{t("No permissions found.")}</p>
            )}
          </div> */}
          <PermissionsTable selected={permissionsFields} setSelected={setPermissionsFields} showLabel={false} />
        </ScrollArea>

        <div className="flex justify-end items-center w-full py-2 space-x-4">
          <Button variant="secondary" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={onSave}
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
      </DialogContent>
    </Dialog>
  )
}
