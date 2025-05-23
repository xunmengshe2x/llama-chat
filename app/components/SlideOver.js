import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SlideOver({
  open,
  setOpen,
  systemPrompt,
  setSystemPrompt,
  replicateApiToken,
  setReplicateApiToken,
  handleSubmit,
  temp,
  setTemp,
  maxTokens,
  setMaxTokens,
  topP,
  setTopP,
  models,
  size,
  setSize,
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-kojima-darkgray shadow-xl border-l dark:border-kojima-gray/30 transition-colors duration-300">
                    <div className="px-4 sm:px-6 py-6 bg-gray-50 dark:bg-kojima-gray border-b dark:border-kojima-gray/50 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-apple-text-primary">
                          Settings
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-kojima-gray text-gray-400 dark:text-apple-text-tertiary hover:text-gray-500 dark:hover:text-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-accent-blue dark:focus:ring-apple-accent-blue/70 transition-colors duration-200"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6 py-6">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                          <div>
                            <label
                              htmlFor="systemPrompt"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-apple-text-primary"
                            >
                              System Prompt
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="systemPrompt"
                                name="systemPrompt"
                                rows={4}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-apple-text-primary bg-white dark:bg-kojima-gray shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray/50 placeholder:text-gray-400 dark:placeholder:text-apple-text-quaternary focus:ring-2 focus:ring-inset focus:ring-apple-accent-blue dark:focus:ring-apple-accent-blue/70 sm:text-sm sm:leading-6 transition-colors duration-200"
                                defaultValue={systemPrompt}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-apple-text-tertiary">
                              This is prepended to the model context to steer
                              model behavior.
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor="replicateApiToken"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-apple-text-primary"
                            >
                              Replicate API Token
                            </label>
                            <div className="mt-2">
                              <input
                                type="password"
                                id="replicateApiToken"
                                name="replicateApiToken"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-apple-text-primary bg-white dark:bg-kojima-gray shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray/50 placeholder:text-gray-400 dark:placeholder:text-apple-text-quaternary focus:ring-2 focus:ring-inset focus:ring-apple-accent-blue dark:focus:ring-apple-accent-blue/70 sm:text-sm sm:leading-6 transition-colors duration-200"
                                defaultValue={replicateApiToken}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-apple-text-tertiary">
                              Get your token at{" "}
                              <a
                                href="https://replicate.com/account/api-tokens"
                                target="_blank"
                                className="text-apple-accent-blue hover:text-apple-accent-indigo transition-colors duration-200"
                              >
                                replicate.com/account/api-tokens
                              </a>
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor="temperature"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-apple-text-primary"
                            >
                              Temperature: {temp}
                            </label>
                            <div className="mt-2">
                              <input
                                id="temperature"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={temp}
                                onChange={(e ) => setTemp(e.target.value)}
                                className="w-full h-2 bg-gray-200 dark:bg-kojima-gray rounded-lg appearance-none cursor-pointer accent-apple-accent-blue dark:accent-apple-accent-blue/90 transition-colors duration-200"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-apple-text-tertiary">
                              Adjusts randomness of outputs, 0 is deterministic.
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor="topP"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-apple-text-primary"
                            >
                              Top P: {topP}
                            </label>
                            <div className="mt-2">
                              <input
                                id="topP"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={topP}
                                onChange={(e) => setTopP(e.target.value)}
                                className="w-full h-2 bg-gray-200 dark:bg-kojima-gray rounded-lg appearance-none cursor-pointer accent-apple-accent-blue dark:accent-apple-accent-blue/90 transition-colors duration-200"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-apple-text-tertiary">
                              Nucleus sampling, controls randomness.
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor="maxTokens"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-apple-text-primary"
                            >
                              Max tokens: {maxTokens}
                            </label>
                            <div className="mt-2">
                              <input
                                id="maxTokens"
                                type="range"
                                min="1"
                                max="4096"
                                step="1"
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(e.target.value)}
                                className="w-full h-2 bg-gray-200 dark:bg-kojima-gray rounded-lg appearance-none cursor-pointer accent-apple-accent-blue dark:accent-apple-accent-blue/90 transition-colors duration-200"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-apple-text-tertiary">
                              Maximum number of tokens to generate.
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="rounded-md bg-white dark:bg-kojima-gray px-3 py-2 text-sm font-semibold text-gray-900 dark:text-apple-text-primary shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray/50 hover:bg-gray-50 dark:hover:bg-kojima-gray/80 transition-colors duration-200"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 rounded-md bg-apple-accent-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-apple-accent-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-accent-blue transition-colors duration-200"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
