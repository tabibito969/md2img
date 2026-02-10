import { useMemo, useState } from 'react'
import {
    X,
    Share2,
    Users,
    FolderOpen,
    Library,
    Copy,
    Save,
    Trash2,
    CheckCircle2,
    Circle,
    Plus,
    Download,
    ArrowRightCircle,
} from 'lucide-react'

const TABS = [
    { id: 'share', label: '可分享', icon: Share2 },
    { id: 'collab', label: '可协作', icon: Users },
    { id: 'manage', label: '可管理', icon: FolderOpen },
    { id: 'reuse', label: '可复用', icon: Library },
]

const formatTime = (value) => {
    if (!value) return '--'
    try {
        return new Date(value).toLocaleString()
    } catch {
        return '--'
    }
}

async function copyText(value) {
    if (!value) return false
    try {
        await navigator.clipboard.writeText(value)
        return true
    } catch {
        return false
    }
}

export default function WorkspaceHub({
    open,
    onClose,
    activeCardLabel,
    shareLinks,
    onGenerateShareLinks,
    onSaveCurrentProject,
    currentProjectId,
    projectName,
    onProjectNameChange,
    projects,
    onLoadProject,
    onDuplicateProject,
    onDeleteProject,
    members,
    onAddMember,
    onRemoveMember,
    comments,
    onAddComment,
    onToggleCommentResolved,
    onDeleteComment,
    templates,
    onSaveAsTemplate,
    onApplyTemplateToCurrent,
    onInsertTemplateAsCard,
    onDeleteTemplate,
}) {
    const [activeTab, setActiveTab] = useState('share')
    const [memberInput, setMemberInput] = useState('')
    const [commentInput, setCommentInput] = useState('')
    const [commentAuthor, setCommentAuthor] = useState('')
    const [templateName, setTemplateName] = useState('')
    const [isGeneratingShare, setIsGeneratingShare] = useState(false)

    const unresolvedCount = useMemo(
        () => comments.filter((item) => !item.resolved).length,
        [comments],
    )
    const effectiveCommentAuthor = members.includes(commentAuthor)
        ? commentAuthor
        : (members[0] || '')

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-[780px] h-full bg-[#0f1220] border-l border-white/10 flex flex-col">
                <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.16em] text-white/35">
                            Workspace Center
                        </span>
                        <span className="text-xs text-white/45">
                            当前卡片：{activeCardLabel}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-md text-white/45 hover:text-white/85 hover:bg-white/[0.05]"
                        aria-label="关闭"
                    >
                        <X className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                </div>

                <div className="px-3 pt-2 border-b border-white/8 flex items-center gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-t-md text-xs inline-flex items-center gap-1.5 border ${
                                    isActive
                                        ? 'border-white/15 bg-white/[0.04] text-white/90'
                                        : 'border-transparent text-white/45 hover:text-white/70'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {activeTab === 'share' && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                <h3 className="text-sm font-medium text-white/90 mb-1">分享链接</h3>
                                <p className="text-xs text-white/45 mb-3">
                                    生成后可复制“只读预览链接”或“可协作编辑链接”。
                                </p>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsGeneratingShare(true)
                                        await onGenerateShareLinks?.()
                                        setIsGeneratingShare(false)
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/85 hover:bg-indigo-500 text-sm disabled:opacity-50"
                                    disabled={isGeneratingShare}
                                >
                                    <Share2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                                    {isGeneratingShare ? '生成中...' : '生成分享链接'}
                                </button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-white/70">只读预览链接</span>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await copyText(shareLinks.view)
                                            }}
                                            className="p-1 rounded text-white/45 hover:text-white/85"
                                            title="复制"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={shareLinks.view || ''}
                                        readOnly
                                        className="w-full h-28 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-[11px] text-white/70 leading-relaxed"
                                    />
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-white/70">可协作编辑链接</span>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await copyText(shareLinks.edit)
                                            }}
                                            className="p-1 rounded text-white/45 hover:text-white/85"
                                            title="复制"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={shareLinks.edit || ''}
                                        readOnly
                                        className="w-full h-28 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-[11px] text-white/70 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'collab' && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">协作成员</h3>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        value={memberInput}
                                        onChange={(event) => setMemberInput(event.target.value)}
                                        placeholder="输入成员名"
                                        className="flex-1 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onAddMember?.(memberInput)) {
                                                setMemberInput('')
                                            }
                                        }}
                                        className="px-2.5 py-1.5 rounded-md bg-white/[0.06] text-xs text-white/80 hover:bg-white/[0.10]"
                                    >
                                        添加
                                    </button>
                                </div>
                                <div className="space-y-1.5 max-h-56 overflow-auto">
                                    {members.map((member) => (
                                        <div
                                            key={member}
                                            className="flex items-center justify-between rounded-md border border-white/10 bg-[#0a0d18] px-2 py-1.5"
                                        >
                                            <span className="text-xs text-white/80">{member}</span>
                                            <button
                                                type="button"
                                                onClick={() => onRemoveMember?.(member)}
                                                className="text-[11px] text-red-300/70 hover:text-red-300"
                                            >
                                                移除
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">
                                    当前卡片评论
                                </h3>
                                <div className="flex gap-2 mb-2">
                                    <select
                                        value={effectiveCommentAuthor}
                                        onChange={(event) => setCommentAuthor(event.target.value)}
                                        className="w-[120px] bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80"
                                    >
                                        {members.map((member) => (
                                            <option key={member} value={member}>
                                                {member}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onAddComment?.(effectiveCommentAuthor, commentInput)) {
                                                setCommentInput('')
                                            }
                                        }}
                                        className="px-2.5 py-1.5 rounded-md bg-indigo-500/85 hover:bg-indigo-500 text-xs"
                                    >
                                        发表评论
                                    </button>
                                </div>
                                <textarea
                                    value={commentInput}
                                    onChange={(event) => setCommentInput(event.target.value)}
                                    placeholder="输入协作意见..."
                                    className="w-full h-20 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80 mb-3"
                                />
                                <div className="mb-2 text-[11px] text-white/40">
                                    未解决评论：{unresolvedCount}
                                </div>
                                <div className="space-y-2 max-h-64 overflow-auto">
                                    {comments.length === 0 && (
                                        <p className="text-xs text-white/40">当前卡片暂无评论</p>
                                    )}
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-md border border-white/10 bg-[#0a0d18] p-2"
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <span className="text-xs text-white/80">
                                                    {comment.author}
                                                </span>
                                                <span className="text-[10px] text-white/40">
                                                    {formatTime(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/68 whitespace-pre-wrap">
                                                {comment.text}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onToggleCommentResolved?.(comment.id)}
                                                    className="inline-flex items-center gap-1 text-[11px] text-white/55 hover:text-white/80"
                                                >
                                                    {comment.resolved ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                                                    ) : (
                                                        <Circle className="h-3.5 w-3.5" />
                                                    )}
                                                    {comment.resolved ? '已解决' : '标记解决'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteComment?.(comment.id)}
                                                    className="text-[11px] text-red-300/70 hover:text-red-300"
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manage' && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">项目管理</h3>
                                <div className="flex gap-2">
                                    <input
                                        value={projectName}
                                        onChange={(event) => onProjectNameChange?.(event.target.value)}
                                        placeholder="项目名称"
                                        className="flex-1 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onSaveCurrentProject?.()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-500/85 hover:bg-indigo-500 text-xs"
                                    >
                                        <Save className="h-3.5 w-3.5" />
                                        {currentProjectId ? '更新项目' : '保存项目'}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">本地项目列表</h3>
                                <div className="space-y-2 max-h-[420px] overflow-auto">
                                    {projects.length === 0 && (
                                        <p className="text-xs text-white/40">还没有已保存项目</p>
                                    )}
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="rounded-md border border-white/10 bg-[#0a0d18] px-2.5 py-2"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-white/82 truncate">
                                                        {project.name}
                                                    </p>
                                                    <p className="text-[10px] text-white/38">
                                                        更新于 {formatTime(project.updatedAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onLoadProject?.(project.id)}
                                                        className="inline-flex items-center gap-1 text-[11px] text-white/65 hover:text-white"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        打开
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDuplicateProject?.(project.id)}
                                                        className="text-[11px] text-white/65 hover:text-white"
                                                    >
                                                        复制
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteProject?.(project.id)}
                                                        className="text-[11px] text-red-300/75 hover:text-red-300"
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reuse' && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">模板复用</h3>
                                <div className="flex gap-2">
                                    <input
                                        value={templateName}
                                        onChange={(event) => setTemplateName(event.target.value)}
                                        placeholder="模板名称"
                                        className="flex-1 bg-[#0a0d18] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white/80"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onSaveAsTemplate?.(templateName)) {
                                                setTemplateName('')
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.08] hover:bg-white/[0.12] text-xs"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        保存当前卡片为模板
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                <h3 className="text-sm font-medium text-white/90 mb-2">自定义模板库</h3>
                                <div className="space-y-2 max-h-[420px] overflow-auto">
                                    {templates.length === 0 && (
                                        <p className="text-xs text-white/40">暂无自定义模板</p>
                                    )}
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="rounded-md border border-white/10 bg-[#0a0d18] px-2.5 py-2"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-white/82 truncate">
                                                        {template.name}
                                                    </p>
                                                    <p className="text-[10px] text-white/38">
                                                        创建于 {formatTime(template.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => onApplyTemplateToCurrent?.(template.id)}
                                                        className="inline-flex items-center gap-1 text-[11px] text-white/65 hover:text-white"
                                                    >
                                                        <ArrowRightCircle className="h-3.5 w-3.5" />
                                                        应用当前卡片
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onInsertTemplateAsCard?.(template.id)}
                                                        className="text-[11px] text-white/65 hover:text-white"
                                                    >
                                                        插入新卡片
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteTemplate?.(template.id)}
                                                        className="text-[11px] text-red-300/75 hover:text-red-300"
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
