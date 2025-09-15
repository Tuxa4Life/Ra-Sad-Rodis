import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'

const questionArr = []

const getPageCount = async () => {
    try {
        const { data } = await axios.get('http://moazrovne.net/chgk/1')
        const $ = cheerio.load(data)

        const text = $('.paginator_pages').first().text()
        const pageCount = text.split(' ')[0]

        return parseInt(pageCount, 10)
    } catch (err) {
        console.error(err)
        return null
    }
}

const pageCount = await getPageCount()
for (let i = 1; i <= pageCount; i++) {
    const { data } = await axios.get(`http://moazrovne.net/chgk/${i}`)
    const $ = cheerio.load(data)

    $('.q').each((_, el) => {
        const q = $(el)
        let obj = {}

        obj.id = q.find('.question_top .left').first().text().trim().split('#')[1]
        obj.question = q.find('.question_question').first().text().trim()
        obj.answer = q.find('.answer .answer_body .clearfix .right_nofloat').first().text().trim()
        obj.explanation = q.find('.answer .answer_body .clearfix .right_nofloat').eq(1).text().trim()

        questionArr.push(obj)
    })
}

fs.writeFileSync('questions.json', JSON.stringify(questionArr, null, 2), 'utf-8')