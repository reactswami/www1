import { type UseDisclosureReturn } from "@chakra-ui/react";
import { type UseMutateFunction } from "@tanstack/react-query";
import { type AxiosResponse } from "axios";
import { type UseFormReturn } from "react-hook-form";

export type UseImportRangesFromFileReturn = {
   ipRangeDisclosure: UseDisclosureReturn;
   uploadIpRange: UseMutateFunction<AxiosResponse<any, any>, Error, ImportRangesFromFileFormData, unknown>;
   isUploading: boolean;
   methods: UseFormReturn;
};

export type ImportRangesFromFileFormData = {
   file: string;
};

