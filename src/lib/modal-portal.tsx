"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function ModalPortal({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();

  if (!mounted) return null;

  return createPortal(children, document.body);
}
