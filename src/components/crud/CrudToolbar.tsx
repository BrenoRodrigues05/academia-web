import { ReactNode } from "react";

import {
  Box,
  Stack,
} from "@mui/material";

import {
  AppButton,
  AppPageHeader,
  AppSearch,
} from "@/components/ui";

type Props = {

  title: string;

  subtitle: string;

  searchPlaceholder: string;

  onSearch: (value: string) => void;

  onCreate: () => void;

  createLabel?: string;

  actions?: ReactNode;

};

export default function CrudToolbar({

  title,

  subtitle,

  searchPlaceholder,

  onSearch,

  onCreate,

  createLabel = "Novo",

  actions,

}: Props) {

  return (

    <Box mb={3}>

      <AppPageHeader

        title={title}

        subtitle={subtitle}

        action={

          <AppButton
            onClick={onCreate}
          >

            {createLabel}

          </AppButton>

        }

      />

      <Stack
        mt={3}
        spacing={2}
      >

        <AppSearch

          placeholder={searchPlaceholder}

          onSearch={onSearch}

        />

        {actions}

      </Stack>

    </Box>

  );

}