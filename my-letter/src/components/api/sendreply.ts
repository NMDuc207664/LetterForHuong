import axios from 'axios'
import type { SendReplyRequest } from '../../components/constants/SendReplyRequest'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5017'

// Giá trị mặc định cho From/To/Subject, chỉ Content là do người dùng nhập.
const DEFAULT_FROM = 'Huong@sender.com'
const DEFAULT_TO = 'boydbvn@gmail.com'
const DEFAULT_SUBJECT = 'Hãy đọc tớ đi nhé!!'

type SendLetterResult = {
    ok: boolean
    message?: string
    error?: string
}

export const sendLetter = async (content: string): Promise<SendLetterResult> => {
    const payload: SendReplyRequest = {
        From: DEFAULT_FROM,
        To: DEFAULT_TO,
        Subject: DEFAULT_SUBJECT,
        Content: content,
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/api/letter/send`, payload)
        return { ok: true, message: response.data?.message }
    } catch (error) {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
        return { ok: false, error: message ?? 'Không thể kết nối đến server.' }
    }
}