import { useQuery, useQueryClient } from "@tanstack/react-query";
import Section from "@/components/layout/Section";
import HeaderText from "@/components/layout/header-text";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "./components/LoadingSkeleton";
import SectionCard from "./components/SectionCard";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { SectionDialog } from "./components/SectionDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import { HOME_SECTION_URL } from "@/utils/constants/urls";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Pagination from "@/components/layout/Pagination";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { Plus } from "lucide-react";
import { EditSectionDialog } from "./components/EditSectionDialog";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";

const Sections = () => {
  const axiosPrivate = useAxiosPrivate();
  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isEditSectionDialogOpen, setIsEditSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();
  const fetchHomeSections = async (page) => {
    return axiosPrivate.get(
      `${HOME_SECTION_URL}?page=${page}&page_size=${itemPerPage}`
    );
  };
  const [isArabic, setIsArabic] = useState(true);

  const [sectionsData, setSectionsData] = useState([]);
  const {
    data: sections,
    error: sectionsError,
    isLoading: sectionsLoading,
    isError,
  } = useQuery({
    queryKey: ["Sections", page, itemPerPage],
    queryFn: () => fetchHomeSections(page),
    // { enabled: !!searchTerm  || !!productId|| !!availableQuantity||!!price||!!discountStartDate||!!discountExpiryDate||!!dateAdded||!!dateModified||!!status||!!categoryId||!!reRenderProducts }
  });
  useEffect(() => {
    if (sections?.data?.results?.length) {
      setSectionsData(
        sections?.data?.results?.sort((a, b) => a.order_id - b.order_id)
      );
    }
  }, [sections]);

  const totalPages = Math.ceil(sections?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddSection = () => {
    setIsSectionDialogOpen(true);
    setSelectedSection(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getSectionPos = (id) =>
    sectionsData.find((section) => section.id === id);
  const getSectionIndex = (id) =>
    sectionsData.findIndex((section) => section.id === id);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const oldPos = getSectionPos(active.id);
    const newPos = getSectionPos(over.id);

    if (oldPos?.id && newPos?.id) {
      setSectionsData((sections) => {
        const originalPos = getSectionIndex(active.id);
        const newPos = getSectionIndex(over.id);

        return arrayMove(sections, originalPos, newPos);
      });

      try {
        const oldPosResponse = await axiosPrivate.put(
          `${HOME_SECTION_URL}${oldPos.id}/`,

          {
            order_id: newPos.order_id,
          }
        );
        const newPosResponse = await axiosPrivate.put(
          `${HOME_SECTION_URL}${newPos.id}/`,

          {
            order_id: oldPos.order_id,
          }
        );

        if (newPosResponse.status === 200 && oldPosResponse.status === 200) {
          toast({
            title: "Success",
            description: "Moved successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["Sections"] });
        }
      } catch (error) {
        // Handle the error

        if (error?.response?.status && error?.response?.status !== 500) {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: error.response?.data?.error,
          });
        } else if (error.code === "ERR_NETWORK") {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "Network error, please try again",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "An unknown error occurred. Please try again later",
          });
        }
        return error;
      }
    }
  };

  return (
    <CanSection permissions={["app_api.view_homepagesections"]}>
      <Section className="space-y-8 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{t("Sections")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center w-full h-fit ">
          <HeaderText className="" text={t("Home Sections")} />
          <div className="flex justify-end items-center gap-2">
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />
            <Can permissions={["app_api.add_homepagesections"]}>
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
                {t("Add New Section")}
              </Button>
            </Can>
          </div>
        </div>
        <WrapperComponent
          isEmpty={!sections?.data?.results.length}
          isError={isError}
          error={sectionsError}
          isLoading={sectionsLoading}
          loadingUI={
            <div className="grid grid-cols-4 gap-8 place-content-center place-items-center w-full h-full">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <LoadingSkeleton key={item} />
              ))}
            </div>
          }
        >
          <div className="flex flex-col justify-start items-center w-full h-full space-y-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div
                id="sections"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-content-start place-items-center w-full h-full"
              >
                <SortableContext
                  items={sectionsData}
                  strategy={rectSortingStrategy}
                >
                  {sectionsData?.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                      setSelectedSection={setSelectedSection}
                      setIsSectionDialogOpen={setIsSectionDialogOpen}
                      setIsArabic={setIsArabic}
                      isArabic={isArabic}
                    />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
            <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
              <Pagination
                itemPerPage={itemPerPage}
                next={sections?.data?.next}
                previous={sections?.data?.previous}
                totalPages={totalPages}
                totalCount={sections?.data?.count}
                page={page}
                setPage={setPage}
              />
            </Card>
          </div>
        </WrapperComponent>
        <SectionDialog
          isDialogOpen={isSectionDialogOpen}
          setIsDialogOpen={setIsSectionDialogOpen}
          section={selectedSection}
        />
        <EditSectionDialog
          isDialogOpen={isEditSectionDialogOpen}
          setIsDialogOpen={setIsEditSectionDialogOpen}
          section={selectedSection}
        />
        <OnDeleteDialog
          name={"Sections"}
          heading={"Are you absolutely sure?"}
          description={`This action cannot be undone. This will permanently delete ${
            selectedSection?.section_title?.at(0)?.title
          }.`}
          url={HOME_SECTION_URL}
          id={selectedSection?.id}
          isDialogOpen={isDeleteDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Sections;
