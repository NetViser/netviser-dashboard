"use client";

import { useState } from "react";
import { Burger, Button, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Avatar } from "@mantine/core";
import classes from "./nav-header.module.css";

const links = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/attack-detection", label: "Attack Detection" },
];

export function NavHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Container className="flex items-center gap-2">
          <Avatar
            src="netviser.svg"
            alt="NetViser Logo"
            radius="xl"
            className={"w-12 h-12"}
          />
          <Title order={2}>NetViser</Title>
        </Container>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
