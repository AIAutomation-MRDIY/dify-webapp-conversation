'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import copy from 'copy-to-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Toast from '@/app/components/base/toast'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'

function OpBtn({ children, onClick, title, active }: { children: React.ReactNode, onClick?: () => void, title?: string, active?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
        active
          ? 'text-primary-600 bg-primary-50 dark:text-primary-300 dark:bg-primary-600/20'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

const OpeningStatementIcon: FC<{ className?: string }> = ({ className }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.25002 1C3.62667 1 1.50002 3.12665 1.50002 5.75C1.50002 6.28 1.58702 6.79071 1.7479 7.26801C1.7762 7.35196 1.79285 7.40164 1.80368 7.43828L1.80722 7.45061L1.80535 7.45452C1.79249 7.48102 1.77339 7.51661 1.73766 7.58274L0.911727 9.11152C0.860537 9.20622 0.807123 9.30503 0.770392 9.39095C0.733879 9.47635 0.674738 9.63304 0.703838 9.81878C0.737949 10.0365 0.866092 10.2282 1.05423 10.343C1.21474 10.4409 1.38213 10.4461 1.475 10.4451C1.56844 10.444 1.68015 10.4324 1.78723 10.4213L4.36472 10.1549C4.406 10.1506 4.42758 10.1484 4.44339 10.1472L4.44542 10.147L4.45161 10.1492C4.47103 10.1562 4.49738 10.1663 4.54285 10.1838C5.07332 10.3882 5.64921 10.5 6.25002 10.5C8.87338 10.5 11 8.37335 11 5.75C11 3.12665 8.87338 1 6.25002 1ZM4.48481 4.29111C5.04844 3.81548 5.7986 3.9552 6.24846 4.47463C6.69831 3.9552 7.43879 3.82048 8.01211 4.29111C8.58544 4.76175 8.6551 5.562 8.21247 6.12453C7.93825 6.47305 7.24997 7.10957 6.76594 7.54348C6.58814 7.70286 6.49924 7.78255 6.39255 7.81466C6.30103 7.84221 6.19589 7.84221 6.10436 7.81466C5.99767 7.78255 5.90878 7.70286 5.73098 7.54348C5.24694 7.10957 4.55867 6.47305 4.28444 6.12453C3.84182 5.562 3.92117 4.76675 4.48481 4.29111Z" fill="#667085" />
  </svg>
)

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

const EditIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 11.9998L13.3332 12.7292C12.9796 13.1159 12.5001 13.3332 12.0001 13.3332C11.5001 13.3332 11.0205 13.1159 10.6669 12.7292C10.3128 12.3432 9.83332 12.1265 9.33345 12.1265C8.83359 12.1265 8.35409 12.3432 7.99998 12.7292M2 13.3332H3.11636C3.44248 13.3332 3.60554 13.3332 3.75899 13.2963C3.89504 13.2637 4.0251 13.2098 4.1444 13.1367C4.27895 13.0542 4.39425 12.9389 4.62486 12.7083L13 4.33316C13.5523 3.78087 13.5523 2.88544 13 2.33316C12.4477 1.78087 11.5523 1.78087 11 2.33316L2.62484 10.7083C2.39424 10.9389 2.27894 11.0542 2.19648 11.1888C2.12338 11.3081 2.0695 11.4381 2.03684 11.5742C2 11.7276 2 11.8907 2 12.2168V13.3332Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const EditIconSolid: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clip-rule="evenodd" d="M10.8374 8.63108C11.0412 8.81739 11.0554 9.13366 10.8691 9.33747L10.369 9.88449C10.0142 10.2725 9.52293 10.5001 9.00011 10.5001C8.47746 10.5001 7.98634 10.2727 7.63157 9.8849C7.45561 9.69325 7.22747 9.59515 7.00014 9.59515C6.77271 9.59515 6.54446 9.69335 6.36846 9.88517C6.18177 10.0886 5.86548 10.1023 5.66201 9.91556C5.45853 9.72888 5.44493 9.41259 5.63161 9.20911C5.98678 8.82201 6.47777 8.59515 7.00014 8.59515C7.52251 8.59515 8.0135 8.82201 8.36867 9.20911L8.36924 9.20974C8.54486 9.4018 8.77291 9.50012 9.00011 9.50012C9.2273 9.50012 9.45533 9.40182 9.63095 9.20979L10.131 8.66276C10.3173 8.45895 10.6336 8.44476 10.8374 8.63108Z" fill="#6B7280" />
      <path fillRule="evenodd" clip-rule="evenodd" d="M7.89651 1.39656C8.50599 0.787085 9.49414 0.787084 10.1036 1.39656C10.7131 2.00604 10.7131 2.99419 10.1036 3.60367L3.82225 9.88504C3.81235 9.89494 3.80254 9.90476 3.79281 9.91451C3.64909 10.0585 3.52237 10.1855 3.3696 10.2791C3.23539 10.3613 3.08907 10.4219 2.93602 10.4587C2.7618 10.5005 2.58242 10.5003 2.37897 10.5001C2.3652 10.5001 2.35132 10.5001 2.33732 10.5001H1.50005C1.22391 10.5001 1.00005 10.2763 1.00005 10.0001V9.16286C1.00005 9.14886 1.00004 9.13497 1.00003 9.1212C0.999836 8.91776 0.999669 8.73838 1.0415 8.56416C1.07824 8.4111 1.13885 8.26479 1.22109 8.13058C1.31471 7.97781 1.44166 7.85109 1.58566 7.70736C1.5954 7.69764 1.60523 7.68783 1.61513 7.67793L7.89651 1.39656Z" fill="#6B7280" />
    </svg>
  )
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
  onRegenerate?: () => void
}

// The component needs to maintain its own state to control whether to display input component
const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
  onRegenerate,
}) => {
  const { id, content, feedback, agent_thoughts, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  const { t } = useTranslation()

  const copyText = isAgentMode
    ? (agent_thoughts || []).map(thought => thought.thought).filter(Boolean).join('\n') || content
    : content

  const handleCopy = () => {
    copy(copyText)
    Toast.notify({ type: 'success', message: 'Copied' })
  }

  const toggleRating = (rating: 'like' | 'dislike') => {
    onFeedback?.(id, { rating: feedback?.rating === rating ? null : rating })
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (
            <StreamdownMarkdown content={item.thought} />
          )}
          {/* {item.tool} */}
          {/* perhaps not use tool */}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id}>
      <div className="flex items-start">
        <div className={`${s.answerIcon} w-10 h-10 shrink-0`}>
          {isResponding
            && (
              <div className={s.typeingIcon}>
                <LoadingAnim type="avatar" />
              </div>
            )}
        </div>
        <div className={`${s.answerWrap} max-w-[calc(100%-3rem)]`}>
          {/* bubble first; actions sit to its right and wrap below when space is tight */}
          <div className='flex flex-wrap content-start items-end gap-1'>
            <div className='relative min-w-0 text-sm text-gray-900 dark:text-gray-100'>
              <div
                className='ml-2 py-3 px-4 rounded-2xl break-words bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0.6)_100%)] dark:bg-[linear-gradient(180deg,#27272A_0%,rgba(39,39,42,0.6)_100%)]'
              >
              {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content))
                ? (
                  <div className="flex items-center justify-center w-6 h-5">
                    <LoadingAnim type="text" />
                  </div>
                )
                : (isAgentMode
                  ? agentModeAnswer
                  : (
                    <StreamdownMarkdown content={content} />
                  ))}
              {suggestedQuestions.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {suggestedQuestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Button className="text-sm" type="link" onClick={() => suggestionClick(suggestion)}>{suggestion}</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
            {/* message actions: like, dislike, copy, regenerate */}
            {!feedbackDisabled && !item.feedbackDisabled && !isResponding && (
              <div className={`${s.itemOperation} w-fit shrink-0 items-center gap-0.5 rounded-[10px] border border-gray-200 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800`}>
              <OpBtn
                title={t('common.operation.like') as string}
                active={feedback?.rating === 'like'}
                onClick={() => toggleRating('like')}
              >
                <RatingIcon isLike={true} />
              </OpBtn>
              <OpBtn
                title={t('common.operation.dislike') as string}
                active={feedback?.rating === 'dislike'}
                onClick={() => toggleRating('dislike')}
              >
                <RatingIcon isLike={false} />
              </OpBtn>
              <OpBtn title='Copy' onClick={handleCopy}>
                <ClipboardDocumentIcon className='w-4 h-4' />
              </OpBtn>
                {onRegenerate && (
                  <OpBtn title='Regenerate' onClick={onRegenerate}>
                    <ArrowPathIcon className='w-4 h-4' />
                  </OpBtn>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Answer)
