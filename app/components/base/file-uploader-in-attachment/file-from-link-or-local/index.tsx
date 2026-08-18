import {
  memo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { RiUploadCloud2Line } from '@remixicon/react'
import FileInput from '../file-input'
import { useFile } from '../hooks'
import { useStore } from '../store'
import { FILE_URL_REGEX } from '../constants'
import type { FileUpload } from '../types'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,  
} from '@/app/components/base/portal-to-follow-elem'
import Button from '@/app/components/base/button'
import cn from '@/utils/classnames'

interface FileFromLinkOrLocalProps {
  showFromLink?: boolean
  showFromLocal?: boolean
  trigger: (open: boolean) => React.ReactNode
  fileConfig: FileUpload
}
const FileFromLinkOrLocal = ({
  showFromLink = true,
  showFromLocal = true,
  trigger,
  fileConfig,
}: FileFromLinkOrLocalProps) => {
  const { t } = useTranslation()
  const files = useStore(s => s.files)
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [showError, setShowError] = useState(false)
  const { handleLoadFileFromLink } = useFile(fileConfig)
  const disabled = !!fileConfig.number_limits && files.length >= fileConfig.number_limits

  const handleSaveUrl = () => {
    if (!url) { return }

    if (!FILE_URL_REGEX.test(url)) {
      setShowError(true)
      return
    }
    handleLoadFileFromLink(url)
    setUrl('')
  }

  return (
    <PortalToFollowElem
      placement='top'
      offset={4}
      open={open}
      onOpenChange={setOpen}
    >
      <PortalToFollowElemTrigger onClick={() => setOpen(v => !v)} asChild>
        {trigger(open)}
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-[1001]'>
        <div className='w-[280px] rounded-xl border border-gray-200 bg-white/95 dark:border-zinc-700 dark:bg-zinc-800/95 backdrop-blur-sm p-3 shadow-lg'>
          {
            showFromLink && (
              <>
                <div className='flex h-8 items-stretch'>
                  <div className={cn(
                    'flex flex-1 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 dark:border-zinc-600 dark:bg-zinc-900/60 pl-2',
                    showError && '!border-red-500',
                  )}>
                    <input
                      className='block w-full appearance-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500 outline-none'
                      placeholder={t('common.fileUploader.pasteFileLinkInputPlaceholder') || ''}
                      value={url}
                      onChange={(e) => {
                        setShowError(false)
                        setUrl(e.target.value.trim())
                      }}
                      disabled={disabled}
                    />
                  </div>
                  <Button
                    className='shrink-0 !h-8 !rounded-l-none !rounded-r-lg !px-3 !py-0 !text-xs'
                    type='primary'
                    disabled={!url || disabled}
                    onClick={handleSaveUrl}
                  >
                    {t('common.operation.ok')}
                  </Button>
                </div>
                {
                  showError && (
                    <div className='mt-0.5 text-xs text-red-500 dark:text-red-400'>
                      {t('common.fileUploader.pasteFileLinkInvalid')}
                    </div>
                  )
                }
              </>
            )
          }
          {
            showFromLink && showFromLocal && (
              <div className='flex h-7 items-center p-2 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500'>
                <div className='mr-2 h-[1px] flex-1 bg-gray-200 dark:bg-zinc-700' />
                OR
                <div className='ml-2 h-[1px] flex-1 bg-gray-200 dark:bg-zinc-700' />
              </div>
            )
          }
          {
            showFromLocal && (
              <Button
                className='relative w-full !border-gray-300 !bg-gray-50 !text-gray-700 hover:!bg-gray-100 dark:!border-zinc-600 dark:!bg-zinc-700/40 dark:!text-gray-200 dark:hover:!bg-zinc-700/70'
                disabled={disabled}
              >
                <RiUploadCloud2Line className='mr-1 h-4 w-4' />
                {t('common.fileUploader.uploadFromComputer')}
                <FileInput fileConfig={fileConfig} />
              </Button>
            )
          }
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default memo(FileFromLinkOrLocal)
