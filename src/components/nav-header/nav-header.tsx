"use client";

import { Badge, Burger, Container, Group, Title, Avatar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./nav-header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { useMemo, useState } from "react";

const links = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/attack-detection", label: "Attack Detection" },
];

export function NavHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const { isActiveSession } = useSessionStore();
  console.log(isActiveSession);

  const items = links.map((link) => (
    <Badge
      variant={pathname !== link.link ? "transparent" : "filled"}
      color="orange"
      size="xl"
      radius="sm"
      id={'nav-header-link-' + link.label + '-badge-' + Math.random()}
      key={link.label}
      className={`mx-1 ${isActiveSession ? "cursor-pointer" : "cursor-not-allowed"}`}
    >
      <Link
        href={link.link}
        data-active={pathname === link.link || undefined}
        style={{
          pointerEvents: isActiveSession ? "auto" : "none",
        }}
      >
        {link.label}
      </Link>
    </Badge>
  ));

  return (
    <header className={classes.header} id={'nav-header-' + isActiveSession}>
      <Container size="md" className={classes.inner}>
        <Link href="/">
          <Container className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src="netviser.svg"
              alt="NetViser Logo"
              radius="xl"
              className="w-12 h-12"
            />
            <Title order={2}>NetViser</Title>
          </Container>
        </Link>
        <Group gap={5} className="hidden sm:flex">
          {items}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className="sm:hidden"
          size="sm"
        />
      </Container>
    </header>
  );
}
