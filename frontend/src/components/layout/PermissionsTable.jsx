import { useEffect, useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Pagination from "@/components/layout/Pagination";
import { PermissionCheckbox } from "@/pages/admins/admin-user/components/PermissionDetails";
import { useModels } from "@/pages/admins/admin-user/hooks/usePermissionModels";
import { cn } from "@/lib/utils";

export default function PermissionsTable({ selected, setSelected, showLabel }) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: permissions, isLoading } = useModels({ page, search: debouncedSearch });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchValue), 300);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const allActions = useMemo(
    () => Array.from(new Set(permissions?.results?.map((p) => p.codename.split("_")[0])) || []),
    [permissions]
  );

  const actions = useMemo(
    () => (allActions.includes("view") ? ["view", ...allActions.filter((a) => a !== "view")] : allActions),
    [allActions]
  );

  const groupedPermissions = useMemo(() => {
    if (!permissions) return [];
    return permissions.results.reduce((acc, p) => {
      const { model, codename, name } = p;
      const action = codename.split("_")[0];
      let entry = acc.find((e) => e.model === model);
      if (!entry) {
        entry = { model, display_name: name || model };
        actions.forEach((a) => (entry[a] = null));
        acc.push(entry);
      }
      entry[action] = p;
      return acc;
    }, []);
  }, [permissions, actions]);

  const handleCheckboxChange = useCallback(
    (permission) => {
      setSelected((prev) => {
        const clean = prev.filter((p) => typeof p === "string");
        return clean.includes(permission.codename)
          ? clean.filter((p) => p !== permission.codename)
          : [...clean, permission.codename];
      });
    },
    [setSelected]
  );

  const totalPages = useMemo(() => {
    if (!permissions?.count) return 1;
    return Math.max(1, Math.ceil(permissions.count / 25));
  }, [permissions]);
  useEffect(() => {
  console.log("Loaded page:", page, "Next:", permissions?.next, "Prev:", permissions?.previous, "permissions selected:", selected);
}, [permissions, page]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {isLoading && <Loader2 className="animate-spin absolute top-2 right-2 text-blue-500" />}
      </div>
      <ScrollArea className="h-[400px] pb-4">
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto mt-8" size={42} />
        ) : (
          <Table className="w-full">
            {/* <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                {actions.map((a) => (
                  <TableHead key={a} className="text-center capitalize">{a}</TableHead>
                ))}
              </TableRow>
            </TableHeader> */}
            <TableBody>
              {groupedPermissions.map((g) => (
                <TableRow key={g.model}>
                  <TableCell className="font-medium">{g.display_name}</TableCell>
                  {actions.map((a) => (
                    <TableCell key={a} className="text-center">
                      {g[a] ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PermissionCheckbox
                                showLabel={false}
                                model={g[a]}
                                className={cn(showLabel === false && "bg-transparent dark:bg-transparent")}
                                isChecked={selected.includes(g[a].codename)}
                                onCheckboxChange={handleCheckboxChange}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{g[a].codename}</p>
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
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Pagination
        next={permissions?.next}
        previous={permissions?.previous}
        totalPages={totalPages}
        totalCount={permissions?.count}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
