import { useQuery } from "@tanstack/react-query";
import Section from "@/components/layout/Section";
import HeaderText from "@/components/layout/header-text";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "./components/LoadingSkeleton";
import RankCard from "./components/RankCard";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import RankDialog from "./components/RankDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import { USER_RANK_URL } from "@/utils/constants/urls";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Pagination from "@/components/layout/Pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Link } from "react-router-dom";

import Can from "@/components/Can";
import CanSection from "@/components/CanSection";
import { Plus } from "lucide-react";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";
const Ranks = () => {
  const axiosPrivate = useAxiosPrivate();
  const {t}= useTranslation()
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("1");
  const [itemPerPage, setItemPerPage] = useState("25");
  const [isSectionDialogOpen, setIsRankDialogOpen] = useState(false);
  const [selectedRank, setIsSelectedRank] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const fetchRanks = async () => {
    return axiosPrivate.get(
      `${USER_RANK_URL}?page=${page}&page_size=${itemPerPage}`
    );
  };

  const {
    data: ranks,
    error: ranksError,
    isLoading: ranksLoading,
    isError,
  } = useQuery({
    queryKey: ["Ranks", page, itemPerPage],
    queryFn: () => fetchRanks(),
  });

  const totalPages = Math.ceil(ranks?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddSection = () => {
    setIsRankDialogOpen(true);
    setIsSelectedRank(null);
  };

  return (
    <CanSection permissions={["app_api.view_userrank"]}>
      <Section className="space-y-8 justify-start h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Ranks")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center w-full h-fit flex-wrap gap-2">
          <HeaderText className={"w-fit text-start "} text={t("Rank List")} />
          <div className="flex justify-end items-center flex-wrap gap-2">
            <Select onValueChange={setLanguage} defaultValue={language}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder={t("Select Language")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Language")}</SelectLabel>
                  <SelectItem value="0">{t("English")}</SelectItem>
                  <SelectItem value="1">{t("Arabic")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
            <Can permissions={["app_api.add_userrank"]}>
              <Button
                onClick={handleAddSection}
                className="flex items-center hover:bg-[#2fad4f] bg-[#2fad4f] gap-1"
              >
                {/* Medium screen and above. */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen. */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Rank")}
              </Button>
            </Can>
          </div>
        </div>
        <WrapperComponent
          isEmpty={!ranks?.data?.results?.length}
          isError={isError}
          error={ranksError}
          isLoading={ranksLoading}
          loadingUI={
            <div className="grid grid-cols-3 gap-8 place-content-center place-items-center w-full h-full">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <LoadingSkeleton key={item} />
              ))}
            </div>
          }
        >
          <div className="flex flex-col justify-start items-center w-full h-full space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-8 place-content-start place-items-center w-full h-full">
              {ranks?.data?.results?.map((rank) => (
                <RankCard
                  key={rank.id}
                  language={language}
                  rank={rank}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  setIsSelectedRank={setIsSelectedRank}
                  setIsRankDialogOpen={setIsRankDialogOpen}
                />
              ))}
            </div>
            <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
              <Pagination
                itemPerPage={itemPerPage}
                next={ranks?.data?.next}
                previous={ranks?.data?.previous}
                totalPages={totalPages}
                totalCount={ranks?.data?.count}
                page={page}
                setPage={setPage}
              />
            </Card>
          </div>
        </WrapperComponent>
        <RankDialog
          isDialogOpen={isSectionDialogOpen}
          setIsDialogOpen={setIsRankDialogOpen}
          rank={selectedRank}
        />
        <OnDeleteDialog
          name={"Ranks"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")} "${
            selectedRank?.rank_name?.at(Number(language))?.rank_name
          }".`}
          url={USER_RANK_URL}
          id={selectedRank?.id}
          isDialogOpen={isDeleteDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Ranks;
