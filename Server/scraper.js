import axios from 'axios'
import * as cheerio from 'cheerio'

const getQuestionCount = async () => {
    try {
        const { data } = await axios.get('http://moazrovne.net/chgk/1')
        const $ = cheerio.load(data)

        const qCount = $('.question_top .left').first().text().trim().split('#')[1]
        return parseInt(qCount, 10)
    } catch (err) {
        console.error(err)
        return null
    }
}

const getQuestion = async (id) => {
    try {
        const { data } = await axios.get(`http://moazrovne.net/q/${id}`)
        const $ = cheerio.load(data)

        const question = $('.question_question').first().text().trim()
        const answer = $('.answer .answer_body .clearfix .right_nofloat').first().text().trim()
        const image = $('.question_image').attr('src')

        const hasExplanation = $('.answer .answer_body .clearfix .left').eq(1).text().trim() === 'კომენტარი:'
        const explanation = hasExplanation ? $('.answer .answer_body .clearfix .right_nofloat').eq(1).text().trim() : ''

        return { id, question, answer, image, explanation }
    } catch (err) {
        console.error(err)
        return null
    }
}

export { getQuestionCount, getQuestion }