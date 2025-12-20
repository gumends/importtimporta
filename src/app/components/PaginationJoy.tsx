"use client";

import { Button, ButtonGroup } from "@mui/joy";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function PaginationJoy({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <ButtonGroup size="lg" sx={{ mt: 3 }}>
      <Button
        disabled={page === 1}
        variant="outlined"
        onClick={() => onChange(page - 1)}
      >
        {"<"}
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          onClick={() => onChange(p)}
          variant={p === page ? "solid" : "outlined"}
          color={p === page ? "primary" : "neutral"}
        >
          {p}
        </Button>
      ))}

      <Button
        disabled={page === totalPages}
        variant="outlined"
        onClick={() => onChange(page + 1)}
      >
        {">"}
      </Button>
    </ButtonGroup>
  );
}
