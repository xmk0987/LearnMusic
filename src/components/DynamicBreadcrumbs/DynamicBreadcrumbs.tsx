"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DynamicBreadcrumbs.module.css";

/**
 * DynamicBreadcrumbs component creates breadcrumb navigation dynamically.
 * It splits the current pathname into segments and generates cumulative links.
 */
const DynamicBreadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const text = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, text };
  });

  return (
    <nav aria-label="breadcrumb" className={styles.nav}>
      <ol>
        <li key="home">
          <Link href="/">Home</Link>
        </li>
        <span>/</span>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            <li key={`link-${crumb.text}-${index}`}>
              {index === breadcrumbs.length - 1 ? (
                <span className={styles.current}>{crumb.text}</span>
              ) : (
                <Link href={crumb.href}>{crumb.text}</Link>
              )}
            </li>
            {index !== breadcrumbs.length - 1 && (
              <span key={`slash-${crumb.text}-${index}`}>/</span>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default DynamicBreadcrumbs;
