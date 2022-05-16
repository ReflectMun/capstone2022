import express from 'express'

/**
 * 로그를 기록하는 함수
 * {날짜} {시간} : {컨트롤러 이름} : {IP} : {메시지}
 * 
 * @param {express.Request} requestObject IP주소 기록을 위한 요청객체
 * @param {string} controllerName 로그 요청이 일어난 컨트롤러의 이름
 * @param {string} message 로그에 기록하려는 메시지
 */
export function normalLog(requestObject, controllerName, message){
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const ip = requestObject.ip

    console.log(`${date} ${time} : ${controllerName} : ${ip} : ${message}`)
}

/**
 * 에러 로그를 기록하는 함수
 * Error : {날짜} {시간} : {컨트롤러 이름} : {IP} : {메시지}
 * 
 * @param {express.Request} requestObject 
 * @param {string} controllerName 
 * @param {string} errorMessage 
 */
export function errorLog(requestObject, controllerName, errorMessage){
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const ip = requestObject.ip

    console.log(`Error : ${date} ${time} : ${controllerName} : ${ip} : ${errorMessage}`)
}