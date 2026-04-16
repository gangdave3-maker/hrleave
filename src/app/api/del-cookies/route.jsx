'use client'
import Cookies from "js-cookie"

export function delCookies(){
    Cookies.remove("customerID")
}