"use client";

import Spinner from "@/components/loader/spinner";
import { getFileName } from "@/utils/client/getFileName";
import { Container, Flex, Text, Title } from "@mantine/core";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const GET_FILE_NAME_URL = "http://localhost:8000/api/get-file-name";

export default function DashboardPage() {
  const extractFileName = (name: string) => {
    console.log(name);
    const [, , ...words] = name.split("/");
    return words.join("/");
  };

  const router = useRouter();
  const { data, isLoading, error } = useSWR(GET_FILE_NAME_URL, getFileName, {
    shouldRetryOnError: false,
  });

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      router.push("/");
    });
    return null; // Prevent further rendering if there's an error
  }

  return (
    <Container className="h-screen flex flex-col pt-24 mx-auto">
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex direction="row" justify="center" align="center" gap={6}>
          <Title order={2} className="mb-6">
            Dashboard for {" "}
          </Title>
          <Title order={2} className="mb-6 text-sky-600" >
            {data ? extractFileName(data?.file_name) : "Unknown"}
          </Title>
        </Flex>
      )}
    </Container>
  );
}
