export default `swagger: "2.0"
info:
  description: |
    ## **http header**
    * **Contetnt-Type**: application/json;charset=UTF-8;
    * **Authorization**: **Basic** $API_KEY_ID:$API_KEY_SECRET
      * 可随便填两个字串，但是一定要带上，今后再来填正确的值

  version: 1.0.0
  title: Kalyke App Service
  contact:
    email: liqin323@gmail.com
host: 119.23.45.58
basePath: /v1
tags:
  - name: authentication
  - name: account
schemes:
  - http
paths:
  /server/version:
    get:
      tags:
        - authentication
      summary: 返回服务器版本，用于ping测试
      operationId: getServerVersion
      consumes:
        - application/json
      produces:
        - application/json
      responses:
        200:
          description: "Return server name, version and build time"
          schema:
            type: object
            required:
              - svr_name
              - svr_ver
              - svr_build_time
            properties:
              svr_name:
                type: string
              svr_ver:
                type: string
              svr_build_time:
                type: string
            example:
              svr_name: kalyke demo server
              svr_ver: 0.00
              svr_build_time: 2017.4.7
        default:
          description: "Error code definitions"
          schema:
            $ref: '#/definitions/ErrorModel'
  /auth/accessTokens:
    post:
      tags:
        - authentication
      summary: Create an access token (login)
      operationId: createAccessToken
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            properties:
              grant_type:
                type: string
                default: phone
                enum:
                  - phone
                  - user_name
                  - email
                  - refresh_token
              password:
                type: string
              refresh_token:
                type: string
              phone:
                type: string
                description: If grant_type== "phone", it must be needed
              user_name:
                type: string
                description: If grant_type== "user_name", it must be needed
              email:
                type: string
                description: If grant_type== "email", it must be needed
            example:
              grant_type: "phone"
              phone: "13688129904"
              password: "654321"
      responses:
        'default':
          description: ""
          schema:
            $ref: '#/definitions/ErrorModel'
        '201':
          description: Create access token successfully
          schema:
            type: object
            required:
              - access_token
              - expires_in
              - refresh_token
            properties:
              href:
                type: string
              account_id:
                type: string
              account_type:
                type: string
              access_token:
                type: string
              expires_in:
                type: integer
                format: int64
              refresh_token:
                type: string
          examples:
            application/json:
              href: "http://112.74.51.210:8090/v1/accounts/0"
              account_id: "0"
              account_type: "worker"
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
              expires_in: 2147483647
              refresh_token: "IiwiYWRtaW4iOnRydWV9"
        '200':
          description: Refresh access token successfully
          schema:
            type: object
            required:
              - access_token
              - expires_in
              - refresh_token
            properties:
              access_token:
                type: string
              expires_in:
                type: integer
                format: int64
              refresh_token:
                type: string
          examples:
            application/json:
              access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
              expires_in: 2147483647
              refresh_token: "IiwiYWRtaW4iOnRydWV9"

  /accounts:
    get:
      tags:
        - account
      summary: 查询账号列表
      description: ''
      operationId: getAllAccounts
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: Successfully
          schema:
            type: object
            description: return array of account url
            required:
              - accounts
            properties:
              accounts:
                type: array
                items:
                  type: string
        default:
          description: |
            Error code definition
          schema:
            $ref: '#/definitions/ErrorModel'
    post:
      tags:
        - account
      summary: 客户端创建账号，目前只会由管理员创建
      operationId: addAccount
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            required:
              - grant_type
              - phone
              - pv_code
              - password
            properties:
              grant_type:
                type: string
                default: phone
                enum:
                  - phone
                  - user_name
                  - email
              password:
                type: string
              phone:
                type: string
                description: If grant_type== "phone", it must be needed
              pv_code:
                type: string
                description: If grant_type== "phone", it must be needed
              user_name:
                type: string
                description: If grant_type== "user_name", it must be needed
              email:
                type: string
                description: If grant_type== "email", it must be needed
            example:
              grant_type: "phone"
              phone: "13688129904"
              pv_code: "123456"
              password: "654321"
      responses:
        '201':
          description: 创建成功，返回账号href
          schema:
            type: object
            required:
              - href
            properties:
              href:
                type: string
          examples:
            application/json:
              href: "http://112.74.51.210:8090/v1/accounts/0"
        'default':
          description: |
            * **10000**: ERR_UNEXPECTED
            * **1000**: ERR_AC_ALREADY_EXIST
            * **1001**: ERR_AC_PVCODE_INVALID
            * **1002**: ERR_AC_PVCODE_NOT_MATCH
            * **1003**: ERR_AC_PVCODE_EXPIRE
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/{accountId}:
    get:
      tags:
        - account
      summary: 查询账号信息
      operationId: queryAccount
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: accountId
          description: ID of the account
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        '200':
          description: 查询成功，返回账号数据
          schema:
            $ref: '#/definitions/AccountModel'
        'default':
          description: ''
          schema:
            $ref: '#/definitions/ErrorModel'
    post:
      tags:
        - account
      summary: 更新账户信息
      operationId: setAccount
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: accountId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
        - in: body
          name: body
          required: true
          schema:
            $ref: "#/definitions/AccountModel"
      responses:
        200:
          description: 更新成功，返回账号href
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: |
            Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/{accountId}/roles:
    get:
      tags:
        - account
      summary: 返回账号的角色
      operationId: queryAccountRoles
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: accountId
          description: ID of the account
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        '200':
          description: Get account's roles by account ID successfully
          schema:
            type: array
            items:
              $ref: '#/definitions/RoleModel'
        'default':
          description: ''
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/{accountId}/projects:
    get:
      tags:
        - project
        - account
      summary: 查询属于指定用户的项目
      operationId: getProjectsByAccount
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: accountId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: 返回项目href列表
          schema:
            $ref: '#/definitions/ProjectHrefList'
        default:
          description: |
            Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/{accountId}/tasks:
    get:
      tags:
        - account
        - task
      summary: 返回指定用户的任务
      operationId: getTasksByAccount
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: accountId
          type: string
          required: true
        - in: query
          name: accessToken
          type: string
          required: true
      responses:
        200:
          description: 任务href列表
          schema:
            type: object
            properties:
              tasks:
                type: array
                items:
                  type: string
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/phoneVerificationCodes:
    post:
      tags:
        - account
      summary: Create code of phone for verification
      operationId: createPVCode
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          description: ''
          required: true
          schema:
            type: object
            required:
              - phone
              - action
            properties:
              phone:
                type: string
                description: phone number
              action:
                type: string
                description: the action which the code is used for
                enum:
                  - register
                  - login
                  - setPassword
      responses:
        '201':
          description: Create verification code successfully
        'default':
          description: |
            * **10000**: ERR_UNEXPECTED
            * **1004**: ERR_PVCODE_INVALID_PHONE_NUMBER
            * **1005**: ERR_PVCODE_SEND_COUNT_EXCEED
            * **1006**: ERR_PVCODE_INVALID_INTERVAL
          schema:
            $ref: '#/definitions/ErrorModel'
  /accounts/passwords:
    post:
      tags:
        - account
      summary: Reset password of an account
      operationId: resetPswd
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          description: ''
          required: true
          schema:
            type: object
            required:
              - phone
              - password
              - pv_code
            properties:
              phone:
                type: string
                description: phone number
              password:
                type: string
                description: new password
              pv_code:
                type: string
                description: phone verification code
      responses:
        '200':
          description: (Re)set password successfully
        'default':
          description: |
            * **10000**: ERR_UNEXPECTED
            * **1004**: ERR_PVCODE_INVALID_PHONE_NUMBER
            * **1005**: ERR_PVCODE_SEND_COUNT_EXCEED
            * **1006**: ERR_PVCODE_INVALID_INTERVAL
            * **1007**: ERR_PVCODE_NOT_MATCH
            * **1008**: ERR_PVCODE_EXPIRED
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects:
    get:
      tags:
        - project
      summary: 查询项目列表
      operationId: getAllProjects
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: accessToken
          type: string
          required: true
      responses:
        200:
          description: 所有项目的href列表
          schema:
            $ref: '#/definitions/ProjectHrefList'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
    post:
      tags:
        - project
      summary: 创建项目
      operationId: createProject
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: accessToken
          type: string
          required: true
        - in: body
          name: body
          required: true
          schema:
            $ref: '#/definitions/ProjectBasisModel'
      responses:
        200:
          description: Href of new project
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects/workTypes:
    get:
      tags:
        - project
      summary: 查询项目工作类型列表
      operationId: getWorkTypes
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: 所有项目的工作类型
          schema:
            type: object
            properties:
              work_types:
                type: array
                items:
                  $ref: '#/definitions/ProjectWorkType'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects/{projectId}:
    get:
      tags:
        - project
      summary: Get Project By ID
      operationId: getProject
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          type: string
          required: true
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: Detail information about selected project
          schema:
            $ref: '#/definitions/ProjectDetailModel'
        default:
          description: Error code definitions
          schema:
            $ref: "#/definitions/ErrorModel"
  /projects/{projectId}/status:
    post:
      tags:
        - project
      summary: 更新项目的进度状态
      operationId: setProgress
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
        - in: body
          name: body
          required: true
          schema:
            $ref: '#/definitions/ProjectStatus'
      responses:
        200:
          description: 项目进度更新成功,返回项目的href
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: Error code definitions
          schema:
            $ref: "#/definitions/ErrorModel"
  /projects/{projectId}/application:
    post:
      tags:
        - project
      summary: 项目信息更新:申报评审相关
      operationId: setProjectApplication
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
        - in: body
          name: body
          required: true
          schema:
            $ref: '#/definitions/ProjectApplicationModel'
      responses:
        200:
          description: 更新后项目的href
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects/{projectId}/team:
    post:
      tags:
        - project
      summary: 项目数据更新:负责人与执行成员
      operationId: setProjectMembers
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          type: string
          required: true
        - in: query
          name: accessToken
          type: string
          required: true
        - in: body
          name: body
          schema:
            type: object
            properties:
              manager:
                description: 负责人
                type: string
              members:
                description: 组员id
                type: array
                items:
                  type: string
      responses:
        200:
          description: 返回项目href
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects/{projectId}/tasks:
    post:
      tags:
        - project
      summary: 项目数据更新:任务划分
      operationId: setProjectTasks
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
        - in: body
          name: body
          required: true
          schema:
            type: object
            properties:
              tasks:
                description: 任务列表
                type: array
                items:
                  type: object
                  properties:
                    name:
                      description: 任务名称
                      type: string
                    content:
                      description: 任务描述
                      type: string
                    assign_to:
                      description: 任务负责人
                      type: string
                    execute:
                      description: 执行小组
                      type: array
                      items:
                        type: string
                    start_ts:
                      description: 开始时间
                      type: integer
                      format: int64
                    end_ts:
                      description: 结束时间
                      type: integer
                      format: int64
      responses:
        200:
          description: 更新成功,返回项目href
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /projects/{projectId}/judgement:
    post:
      tags:
        - project
      summary: 项目数据更新:项目结项评审相关
      operationId: setProjectJudgement
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: projectId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
        - in: body
          name: body
          required: true
          schema:
            $ref: '#/definitions/ProjectJudgementModel'
      responses:
        200:
          description: 更新成功,返回项目href
          schema:
            $ref: '#/definitions/HrefObject'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /tasks/{taskId}:
    get:
      tags:
        - task
      summary: 查询任务信息
      operationId: getTask
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: taskId
          required: true
          type: string
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: 返回任务信息
          schema:
            $ref: '#/definitions/TaskModel'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
  /organization:
    get:
      tags:
        - organization
      summary: 查询组织架构，包括科室及职务
      operationId: getOrganization
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: accessToken
          required: true
          type: string
      responses:
        200:
          description: 返回组织架构信息
          schema:
            $ref: '#/definitions/OrganizationModel'
        default:
          description: Error code definitions
          schema:
            $ref: '#/definitions/ErrorModel'
definitions:
  HrefObject:
    type: object
    required:
      - href
    properties:
      href:
        type: string
    example:
        href: "http://YOUR_HOUST/v1/PATH/DATA_ID"
  ProjectWorkType:
    type: object
    properties:
      id:
        type: string
      name:
        type: string
  ProjectHrefList:
    type: object
    required:
      - projects
    properties:
      projects:
        description: 请求数据的href列表
        type: array
        items:
          type: string
  ProjectStatus:
    type: object
    properties:
      status:
        description: |
          项目进度:
          * 1 申报评审
          * 2 项目启动
          * 3 项目督办
          * 4 项目结项
        type: integer
  ProjectApplicationModel:
    type: object
    properties:
      result:
        description: |
          立项评审结果
          0 待评审
          1 通过
          2 未通过
        type: integer
      leader:
        description: 立项评审负责人
        type: string
      member:
        description: '立项评审团人员'
        type: array
        items:
          type: string
      comment:
        description: '立项评审意见汇总'
        type: string
      application_file:
        description: '立项申请表'
        type: string
      report_file:
        description: 立项评审报告
        type: string
      approval_file:
        description: 立项批准书
        type: string
      review_ts:
        description: '立项评审时间'
        type: integer
        format: int64
  ProjectJudgementModel:
    type: object
    properties:
      result:
        description: |
          结项评审结果
          0 待评审
          1 通过
          2 未通过
        type: integer
      leader:
        description: '结项评审负责人'
        type: string
      member:
        description: '结项评审团人员'
        type: string
      comment:
        description: '结项评审意见汇总'
        type: string
      report_file:
        description: '结项报告附件'
        type: string
      harvest:
        description: '项目成果'
        type: string
      harvest_file:
        description: '项目成果附件'
        type: string
      conclusion:
        description: '结项总结'
        type: string
      judge_file:
        description: '结项评审报告附件'
        type: string
      judge_ts:
        description: '结项评审时间'
        type: integer
        format: int64
      actual_ts:
        description: '实际结项时间'
        type: integer
        format: int64
  TaskModel:
    type: object
    properties:
      name:
        description: 任务名称
        type: string
      content:
        description: 任务描述
        type: string
      assign_to:
        description: 任务负责人
        type: string
      execute:
        description: 执行小组
        type: array
        items:
          type: string
      start_ts:
        description: 开始时间
        type: integer
        format: int64
      end_ts:
        description: 结束时间
        type: integer
        format: int64
      status:
        description: 任务状态：0未完成；1已完成
        type: integer
        format: int32
      note:
        type: string
      report_href:
        type: string
  ProjectBasisModel:
    type: object
    properties:
      name:
        description: 项目名称
        type: string
      content:
        description: 项目内容
        type: string
      objective:
        description: 项目目标
        type: string
      manager:
        description: 项目负责人href
        type: string
      member:
        description: 项目成员href
        type: array
        items:
          type: string
      office:
        description: 办公室id
        type: string
      work_type:
        description: 工作类型id
        type: string
      start_ts:
        description: 项目开始时间
        type: integer
        format: int64
      end_ts:
        description: 项目结束时间
        type: integer
        format: int64
      progress:
        description: |
          项目进度:
          * 1 申报评审
          * 2 项目启动
          * 3 项目督办
          * 4 项目结项
        type: integer
      application_file:
        description: 申请材料
        type: string
  ProjectDetailModel:
    type: object
    properties:
      name:
        description: 项目名称
        type: string
      content:
        description: 项目内容
        type: string
      objective:
        description: 项目目标
        type: string
      manager:
        description: 项目负责人href
        type: string
      member:
        description: 项目成员href
        type: array
        items:
          type: string
      office:
        description: 办公室id
        type: string
      work_type:
        description: 工作类型id
        type: string
      start_ts:
        description: 项目开始时间
        type: integer
        format: int64
      end_ts:
        description: 项目结束时间
        type: integer
        format: int64
      progress:
        description: |
          项目进度:
          * 1 申报评审
          * 2 项目启动
          * 3 项目督办
          * 4 项目结项
        type: integer
      application_file:
        description: 申请材料
        type: string
      plan:
        $ref: '#/definitions/ProjectApplicationModel'
      tasks:
        description: 项目下所有的任务href数组
        type: array
        items:
          type: string
      judge:
        $ref: '#/definitions/ProjectJudgementModel'
  AccountModel:
    type: object
    properties:
      #id:
      #  description: 用户id
      #  type: string
      user_name:
        description: 登录名
        type: string
      password:
        description: 密码
        type: string
      name:
        description: 姓名
        type: string
      gender:
        description: "性别: 0-女,1-男"
        type: integer
      phone:
        description: 电话
        type: string
      office:
        description: 科室id
        type: string
      title:
        description: 职务id
        type: string
      id_card:
        description: 身份证
      land_line:
        description: 座机
      email:
        type: string
      qq:
        type: string
      degree:
        description: 学历
        type: string
      college:
        description: 毕业院校
        type: string
      folk:
        description: 民族
        type: string
      paper:
        description: 论文
        type: string
      home_address:
        description: 家庭地址
        type: string
      contact_address:
        description: 通讯地址
        type: string
      create_ts:
        description: 注册时间
        type: integer
        format: int64
      roles:
        type: array
        items:
          $ref: '#/definitions/RoleModel'
  TitleModel:
    type: object
    properties:
      id:
        type: string
      name:
        type: string
  OfficeModel:
    type: object
    properties:
      id:
        type: string
      name:
        type: string
      titles:
        type: array
        items:
          $ref: '#/definitions/TitleModel'
  OrganizationModel:
    type: object
    properties:
      offices:
        type: array
        items:
          $ref: '#/definitions/OfficeModel'
  RoleModel:
    type: object
    required:
      - id
      - href
      - name
      - permissions
    properties:
      id:
        type: string
      href:
        type: string
      name:
        type: string
      display_name:
        type: string
      description:
        type: string
      permissions:
        type: array
        items:
          $ref: '#/definitions/PermissionModel'
  PermissionModel:
    type: object
    required:
      - id
      - href
      - name
      - action
    properties:
      id:
        type: string
      href:
        type: string
      name:
        type: string
      display_name:
        type: string
      description:
        type: string
      object_type:
        type: string
        description: "A string identifying the type of object this permission applies to"
      action:
        type: string
        description: "A string indicating the type of action this permission permits"
      instance:
        type: string
        description: 'A string containing the primary ID of the object instance this permission applies to, or "\*" indicating that it applies to all instances. If the given action does not allow instance specification, "\*" should always be used.'
  ErrorModel:
    type: object
    required:
      - status
      - code
    properties:
      status:
        type: integer
        description: "The corresponding HTTP status code"
      code:
        type: integer
        description: "An specific error code that can be used to obtain more information"
      message:
        type: string
        description: "A simple, easy to understand message that you can show directly to your application"
      message_ext:
        type: string
        description: "A clear, plain text explanation with technical details that might assist a developer calling the API"
    example:
      status: 501
      code: 10000
      message:  "Unexpected error"
      message_ext: ""`
