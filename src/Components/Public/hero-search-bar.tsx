"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    DateField,
    DatePicker,
    Label,
    ListBox,
    Select,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { guestOptions } from "./hero-data";

const FIELD_CLASSES =
    "flex min-h-[50px] flex-col justify-center rounded-xl border border-transparent bg-white px-3 py-2 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:shadow-md focus-within:shadow-indigo-500/8 sm:min-h-[52px] sm:px-3.5";

const LABEL_CLASSES =
    "mb-0.5 block text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[9px]";

interface SearchState {
    location: string;
    checkIn: DateValue | null;
    guests: string;
}

function MorphingGradientBorder({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;
    return (
        <motion.div
            className="pointer-events-none absolute -inset-[1px] rounded-2xl"
            style={{
                background:
                    "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(167,139,250,0.3), rgba(236,72,153,0.3), rgba(99,102,241,0.4))",
                backgroundSize: "300% 100%",
            }}
            initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
            animate={{
                opacity: 1,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            exit={{ opacity: 0 }}
            transition={{
                opacity: { duration: 0.3 },
                backgroundPosition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                },
            }}
        />
    );
}

interface HeroSearchBarProps {
    searchQuery: SearchState;
    isSearchFocused: boolean;
    onSearchChange: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onFocus: () => void;
    onBlur: (e: React.FocusEvent<HTMLFormElement>) => void;
}

export function HeroSearchBar({
    searchQuery,
    isSearchFocused,
    onSearchChange,
    onSubmit,
    onFocus,
    onBlur,
}: HeroSearchBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.75,
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="pointer-events-auto mx-auto mb-6 w-full max-w-3xl sm:mb-8 lg:mb-6 lg:max-w-4xl"
        >
            <motion.div
                animate={{
                    borderColor: isSearchFocused
                        ? "rgba(99,102,241,0.42)"
                        : "rgba(255,255,255,0.12)",
                    backgroundColor: isSearchFocused
                        ? "rgba(255,255,255,0.11)"
                        : "rgba(255,255,255,0.07)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative rounded-2xl border p-1.5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-2"
            >
                <AnimatePresence>
                    {isSearchFocused && (
                        <>
                            <MorphingGradientBorder isActive={isSearchFocused} />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-400/10 to-fuchsia-500/15 blur-sm"
                            />
                        </>
                    )}
                </AnimatePresence>

                <form
                    onSubmit={onSubmit}
                    onFocusCapture={onFocus}
                    onBlurCapture={onBlur}
                    className="relative grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-[1.5fr_1.1fr_1fr_auto]"
                >
                    <motion.div
                        className={`${FIELD_CLASSES} sm:col-span-2 lg:col-span-1`}
                        whileHover={{ scale: 1.01 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    >
                        <label
                            htmlFor="hero-location"
                            className={LABEL_CLASSES}
                        >
                            Where To?
                        </label>
                        <div className="flex items-center gap-2">
                            <motion.svg
                                className="h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                animate={
                                    searchQuery.location
                                        ? {
                                              color: "rgb(99,102,241)",
                                              scale: [1, 1.1, 1],
                                          }
                                        : {}
                                }
                                transition={{ duration: 0.3 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                                />
                            </motion.svg>
                            <input
                                id="hero-location"
                                type="text"
                                required
                                autoComplete="off"
                                placeholder="City, region, or property..."
                                value={searchQuery.location}
                                onChange={(e) =>
                                    onSearchChange("location", e.target.value)
                                }
                                className="h-5 w-full border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 sm:text-[13px]"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className={FIELD_CLASSES}
                        whileHover={{ scale: 1.01 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    >
                        <DatePicker
                            className="w-full"
                            aria-label="Check-in date"
                            value={searchQuery.checkIn}
                            onChange={(date) =>
                                onSearchChange("checkIn", date)
                            }
                        >
                            <Label className={LABEL_CLASSES}>
                                Check-in
                            </Label>
                            <DateField.Group
                                fullWidth
                                className="flex h-5 min-h-0 items-center gap-1 border-0 bg-transparent p-0 shadow-none"
                            >
                                <svg
                                    className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                    />
                                </svg>
                                <DateField.Input className="flex flex-1 items-center gap-0.5 text-xs font-semibold text-slate-800 sm:text-[13px]">
                                    {(segment) => (
                                        <DateField.Segment
                                            segment={segment}
                                            className="rounded px-0.5 py-px text-center outline-none transition-colors data-[placeholder]:text-slate-400 data-[focused]:bg-indigo-100 data-[focused]:text-indigo-800"
                                        />
                                    )}
                                </DateField.Input>
                                <DateField.Suffix>
                                    <DatePicker.Trigger
                                        aria-label="Open date picker"
                                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <DatePicker.TriggerIndicator />
                                    </DatePicker.Trigger>
                                </DateField.Suffix>
                            </DateField.Group>

                            <DatePicker.Popover className="z-[100] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10">
                                <Calendar
                                    aria-label="Check-in date"
                                    className="w-[280px] max-w-[calc(100vw-2rem)] p-3 sm:w-[310px]"
                                >
                                    <Calendar.Header className="mb-2 flex items-center justify-between">
                                        <Calendar.YearPickerTrigger className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">
                                            <Calendar.YearPickerTriggerHeading />
                                            <Calendar.YearPickerTriggerIndicator />
                                        </Calendar.YearPickerTrigger>
                                        <div className="flex gap-1">
                                            <Calendar.NavButton
                                                slot="previous"
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                            />
                                            <Calendar.NavButton
                                                slot="next"
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                            />
                                        </div>
                                    </Calendar.Header>
                                    <Calendar.Grid className="w-full">
                                        <Calendar.GridHeader>
                                            {(day) => (
                                                <Calendar.HeaderCell className="pb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {day}
                                                </Calendar.HeaderCell>
                                            )}
                                        </Calendar.GridHeader>
                                        <Calendar.GridBody>
                                            {(date) => (
                                                <Calendar.Cell
                                                    date={date}
                                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[13px] font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[disabled]:pointer-events-none data-[disabled]:text-slate-300 data-[selected]:bg-indigo-600 data-[selected]:font-bold data-[selected]:text-white data-[today]:font-bold data-[today]:text-indigo-600"
                                                />
                                            )}
                                        </Calendar.GridBody>
                                    </Calendar.Grid>
                                    <Calendar.YearPickerGrid className="mt-2">
                                        <Calendar.YearPickerGridBody>
                                            {({ year }) => (
                                                <Calendar.YearPickerCell
                                                    year={year}
                                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 data-[selected]:bg-indigo-600 data-[selected]:text-white"
                                                />
                                            )}
                                        </Calendar.YearPickerGridBody>
                                    </Calendar.YearPickerGrid>
                                </Calendar>
                            </DatePicker.Popover>
                        </DatePicker>
                    </motion.div>

                    <motion.div
                        className={FIELD_CLASSES}
                        whileHover={{ scale: 1.01 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    >
                        <Select
                            className="w-full"
                            aria-label="Number of guests"
                            placeholder="Select"
                            selectedKey={searchQuery.guests}
                            onSelectionChange={(key) =>
                                onSearchChange(
                                    "guests",
                                    key ? String(key) : "2",
                                )
                            }
                        >
                            <Label className={LABEL_CLASSES}>
                                Guests
                            </Label>
                            <Select.Trigger className="flex h-5 min-h-0 items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 shadow-none sm:text-[13px]">
                                <svg
                                    className="mr-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                    />
                                </svg>
                                <Select.Value className="flex-1 truncate" />
                                <Select.Indicator className="ml-auto text-slate-400" />
                            </Select.Trigger>
                            <Select.Popover className="z-[100] rounded-xl border border-slate-200 bg-white p-1 shadow-2xl shadow-indigo-950/10">
                                <ListBox>
                                    {guestOptions.map((option) => (
                                        <ListBox.Item
                                            key={option.id}
                                            id={option.id}
                                            textValue={option.label}
                                            className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                        >
                                            {option.label}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </motion.div>

                    <motion.button
                        type="submit"
                        whileHover={{
                            scale: 1.03,
                            boxShadow:
                                "0 8px 30px rgba(99,102,241,0.45)",
                        }}
                        whileTap={{ scale: 0.96 }}
                        className="relative min-h-[50px] overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-indigo-600/25 transition-colors sm:col-span-2 sm:min-h-[52px] sm:text-xs lg:col-span-1 lg:min-w-[120px]"
                        style={{ backgroundSize: "200% 100%" }}
                    >
                        <span className="relative z-10 inline-flex items-center justify-center gap-2">
                            <motion.svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </motion.svg>
                            Search
                        </span>
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-200%", "200%"] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 1.5,
                            }}
                        />
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-fuchsia-500/30 to-violet-600/0"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                        />
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}
