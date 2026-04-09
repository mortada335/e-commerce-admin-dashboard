import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { displayBasicDate } from "@/utils/methods";
import historyColumns from "./historyColumns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";
 
export default function ChangeTable({ singleChange }) {
  const [search, setSearch] = useState(null);
  const {t} = useTranslation()
  const handleChanges = (changes, actorName, actorId) => {
    if (search) {
      const arrayOfChanges = Object.entries(JSON.parse(changes))
        .map(([key, [oldValue, newValue]]) => ({
          modify: key,
          old: oldValue,
          new: newValue,
          modify_by: actorName,
          actor_id: actorId,
        }))
        .filter((item) =>
          item.modify.toLowerCase().includes(search?.toLowerCase())
        );

      return arrayOfChanges;
    } else {
      const arrayOfChanges = Object.entries(JSON.parse(changes)).map(
        ([key, [oldValue, newValue]]) => ({
          modify: key,
          old: oldValue,
          new: newValue,
          modify_by: actorName,
          actor_id: actorId,
        })
      );

      return arrayOfChanges;
    }
  };
  return (
    <Card key={singleChange.id} className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="!text-[#333333] capitalize text-xl font-medium w-fit">
          {" "}
          {t("Modification date:")}{" "}<br/>
          {displayBasicDate(singleChange.timestamp || "")}
        </CardTitle>
        <div className="flex items-center">
          <Input
            placeholder={t("Filter modify ...")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm "
          />
        </div>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={historyColumns}
          data={handleChanges(
            singleChange.changes,
            singleChange?.actor_name,
            singleChange?.actor
          )}
          defaultPagination={true}
        ></DataTable>
      </CardContent>
    </Card>
  );
}
