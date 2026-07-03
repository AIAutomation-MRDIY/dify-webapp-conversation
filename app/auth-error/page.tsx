const REASON_MESSAGES: Record<string, string> = {
  missing_code: 'The sign-in request was incomplete. Please try again.',
  state_mismatch: 'The sign-in session expired or was invalid. Please try again.',
  wrong_tenant: 'Your Lark account does not belong to this organization.',
  auth_failed: 'Sign-in with Lark failed. Please try again or contact your administrator.',
  lark_client_required: 'This app can only be opened from inside the Lark app.',
}

const AuthErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) => {
  const { reason } = await searchParams
  const message = REASON_MESSAGES[reason || ''] || 'Access denied.'
  const canRetry = reason !== 'lark_client_required' && reason !== 'wrong_tenant'

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="mx-4 max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-3 text-4xl">🔒</div>
        <h1 className="mb-2 text-lg font-semibold text-gray-800">Access restricted</h1>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        {canRetry && (
          <a
            href="/api/auth/login"
            className="inline-block rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Sign in with Lark
          </a>
        )}
      </div>
    </div>
  )
}

export default AuthErrorPage
