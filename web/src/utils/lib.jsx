// import $ from 'jquery'


// const EnumEnvType = {
//     TEST: 'test', DEVELOPMENT: 'development', PRODUCTION: 'production'
//   }
//   function join(sep, ...props) {
//     let list = flattenDeep(props)
//     if (list && list.length > 0) {
//       return list.filter(it => it).join(sep)
//     }
//     return ""
//   }

// export function Ajax(args) {
//     let {
//       url,
//       async = true,
//       data = {},
//       dataType = null,
//       method = "POST",
//       processData = true,
//       accept = 'application/jsonp; charset=utf-8',
//       contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
//       timeout
//     } = args
  
//     let headers = {
//       accept, 'Content-Type': contentType
//     }
  
//     if (EnumEnvType.DEVELOPMENT == environment && args.cross) {
//       $.ajax({
//         url: args.url + '.jsonp?callback=?&jsonp=success',
//         data, async, headers, dataType: 'jsonp', timeout,
//         success: function (data) {
//           try {
//             args.success(data)
//           } catch (e) {
//             console.log('ajax', args, 'success exception', e)
//           }
//         }
//       })
//     } else {
//       $.ajax({
//         url, data, method, headers, async, dataType, processData, timeout,
//         beforeSend: function (xhr) {
//           if (args.beforeSend && typeof args.beforeSend === 'function') {
//             args.beforeSend(xhr)
//           }
//         },
//         complete: function () {
//           if (args.complete && typeof args.complete === 'function') {
//             args.complete()
//           }
//         },
//         success: function (data) {
//           try {
//             response(data, args.success, args.error, args)
//           } catch (e) {
//             console.log('ajax', args, 'success exception', e)
//           }
//         },
//         error: function (data, textStatus, err) {
//           if (textStatus == "timeout" || /* textStatus=="error" ||*/ textStatus == 'notmodified')
//             message.warn('网络超时,请稍候再试')
//           else
//             message.warn('系统错误')
//           if (data.error && args.error) {
//             args.error(data)
//           }
//         }
//       })
//     }
//   }


// //   module.exports={
// //       Ajax
// //   }