import type { FC } from 'react'
import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import type { PromptConfig } from '@/types/app'

export interface IChangeTopicModalProps {
  isOpen: boolean
  onClose: () => void
  promptConfig: PromptConfig
  savedInputs: Record<string, any>
  onSubmit: (inputs: Record<string, any>) => void
}

// Quick "change topic / category" popup — lets the user update the prompt
// variables driving the conversation without needing to scroll to the top
// of a (possibly very long) chat to find the inline inputs panel.
const ChangeTopicModal: FC<IChangeTopicModalProps> = ({
  isOpen,
  onClose,
  promptConfig,
  savedInputs,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<Record<string, any>>(savedInputs || {})

  // re-seed the form with the latest saved values every time the modal opens
  React.useEffect(() => {
    if (isOpen) { setInputs(savedInputs || {}) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSubmit = () => {
    onSubmit(inputs)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-800 p-5 shadow-xl">
                <Dialog.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Change topic
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update these to steer the conversation in a new direction.
                </Dialog.Description>

                <div className="mt-4 space-y-4">
                  {promptConfig.prompt_variables.map(item => (
                    <div className="text-sm" key={item.key}>
                      <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">
                        {item.name}
                        {!item.required && (
                          <span className="ml-1 font-normal text-gray-400">({t('app.variableTable.optional')})</span>
                        )}
                      </label>

                      {item.type === 'select' && (
                        <Select
                          className="w-full"
                          defaultValue={inputs?.[item.key]}
                          onSelect={i => setInputs({ ...inputs, [item.key]: i.value })}
                          items={(item.options || []).map(i => ({ name: i, value: i }))}
                          allowSearch={false}
                          bgClassName="bg-gray-50 dark:bg-zinc-700"
                        />
                      )}

                      {item.type === 'string' && (
                        <input
                          value={inputs?.[item.key] || ''}
                          onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                          className="w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                          maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                        />
                      )}

                      {item.type === 'paragraph' && (
                        <textarea
                          className="w-full h-[104px] flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                          value={inputs?.[item.key] || ''}
                          onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                        />
                      )}

                      {item.type === 'number' && (
                        <input
                          type="number"
                          className="w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder:text-gray-400"
                          value={inputs?.[item.key] ?? ''}
                          onChange={e => setInputs({ ...inputs, [item.key]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default React.memo(ChangeTopicModal)
