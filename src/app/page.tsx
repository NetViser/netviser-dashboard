"use client";

import { useState } from "react";
import { FileButton, Button, Group, Notification, Container, Title } from "@mantine/core";
import { TbUpload } from "react-icons/tb";
import useSWRMutation from "swr/mutation";
import { uploadFile } from "@/utils/client/uploadFIle";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session";

const UPLOAD_URL = 'http://localhost:8000/api/raw-file-upload';

export default function Home() {
  const router = useRouter();
  const { setActiveSession } = useSessionStore();

  const { trigger, isMutating } = useSWRMutation(UPLOAD_URL, uploadFile, {
    onSuccess: async (_data) => {
      await Swal.fire({
        title: 'File Uploaded Successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Set the active session
      setActiveSession(true);
      // Redirect to the next page
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#f44336',
      });
      console.error('Upload failed:', error);
    },
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      trigger(file);
    }
  };

  return (
    <Container className="h-screen flex flex-col items-center justify-center">
      <Title order={2} className="mb-6">Upload Your Network File</Title>
      
      <Group justify="center">
        <FileButton onChange={handleFileChange} accept="*" multiple={false}>
          {(props) => (
            <Button
              {...props}
              rightSection={<TbUpload size={24} />}
              loading={isMutating}
              loaderProps={{ type: "dots", size: 36 }}
              variant="gradient"
              gradient={{ from: 'orange', to: 'red', deg: 235 }}
              className="hover:scale-105 w-96 h-20 rounded-full text-2xl font-bold"
            >
              {'Choose Network File'}
            </Button>
          )}
        </FileButton>
      </Group>
    </Container>
  );
}
