# BTR Phase 2: Cognito User Pool Setup - COMPLETED ✅

## 📋 Overview
**Phase**: Cognito User Pool Setup  
**Duration**: 10 minutes  
**Status**: ✅ COMPLETED  
**Date**: November 17, 2025  
**AWS Account**: 367471965495  

## 🎯 Objectives Achieved
- ✅ Create Cognito User Pool for BTR authentication
- ✅ Configure custom attributes for regional assignment
- ✅ Establish user groups for each region
- ✅ Create test users including Sir Cons (super admin)
- ✅ Set up web app client for React integration

## 🏗️ Infrastructure Created

### Cognito User Pool
**Pool ID**: `ap-southeast-1_AkRq0F7rd`  
**Pool Name**: `BTR-Treasury-UserPool`  
**Region**: `ap-southeast-1`  
**Authentication**: Email-based login  

### User Pool Client
**Client ID**: `7o9770rpftnrf20i9vja01qba5`  
**Client Name**: `BTR-WebApp-Client`  
**Client Secret**: `i7pg41u105gg52lv6rhk7cqgk0o9si303dfibo2ij47ts7f1rh2`  
**Auth Flows**: `USER_PASSWORD_AUTH`, `ADMIN_NO_SRP_AUTH`  

## 👥 User Management Structure

### Custom Attributes
```json
{
  "custom:region": "String - User's assigned region (NCR, REGION-1, etc.)",
  "custom:role": "String - User's role (admin, super-admin)"
}
```

### User Groups (9 Groups Created)
| Group Name | Description | Region Access |
|------------|-------------|---------------|
| `ncr-users` | NCR Region Treasury Users | NCR folder only |
| `region1-users` | Region 1 Treasury Users | REGION-1 folder only |
| `region2-users` | Region 2 Treasury Users | REGION-2 folder only |
| `region3-users` | Region 3 Treasury Users | REGION-3 folder only |
| `region4a-users` | Region 4A Treasury Users | REGION-4A folder only |
| `region4b-users` | Region 4B Treasury Users | REGION-4B folder only |
| `region5-users` | Region 5 Treasury Users | REGION-5 folder only |
| `region6-users` | Region 6 Treasury Users | REGION-6 folder only |
| `super-admin` | Sir Cons - All Regions Access | ALL folders |

## 👤 Test Users Created

### Super Administrator
**Email**: `sir.cons@btr.gov.ph`  
**Region**: `ALL`  
**Role**: `super-admin`  
**Group**: `super-admin`  
**Access**: All regional folders + unified dashboard  

### Regional Administrators
| Email | Region | Role | Group | Access |
|-------|--------|------|-------|---------|
| `ncr.admin@btr.gov.ph` | NCR | admin | ncr-users | NCR folder only |
| `region1.admin@btr.gov.ph` | REGION-1 | admin | region1-users | REGION-1 folder only |

### Login Credentials
**Temporary Password**: `TempPass123!`  
**Status**: `FORCE_CHANGE_PASSWORD` (users must change on first login)  
**Password Policy**: Min 8 chars, uppercase, lowercase, numbers required  

## 🔧 Technical Configuration

### Password Policy
```json
{
  "MinimumLength": 8,
  "RequireUppercase": true,
  "RequireLowercase": true,
  "RequireNumbers": true,
  "RequireSymbols": false,
  "TemporaryPasswordValidityDays": 7
}
```

### Authentication Settings
- **Username Attributes**: Email
- **Auto Verified Attributes**: Email
- **MFA**: Disabled (can be enabled later)
- **Account Recovery**: Email-based

## 🔐 Security Features

### User Pool Security
- ✅ Email verification required
- ✅ Strong password policy
- ✅ Temporary password expiration (7 days)
- ✅ Account lockout protection
- ✅ Regional attribute isolation

### Access Control Preparation
- ✅ Custom attributes for regional assignment
- ✅ Group-based permissions ready
- ✅ Role-based access control structure
- ✅ Super admin separation

## 🔗 Integration Points

### React App Integration
```javascript
// Amplify Configuration
const awsconfig = {
  Auth: {
    region: 'ap-southeast-1',
    userPoolId: 'ap-southeast-1_AkRq0F7rd',
    userPoolWebClientId: '7o9770rpftnrf20i9vja01qba5',
  }
};
```

### User Attribute Access
```javascript
// Get user's region
const region = user.attributes['custom:region'];
const role = user.attributes['custom:role'];
```

## 📊 User Management Dashboard

### Current Users
- **Total Users**: 3
- **Super Admins**: 1 (Sir Cons)
- **Regional Admins**: 2 (NCR, Region 1)
- **Pending Regions**: 12 (to be created as needed)

### Group Membership
```
super-admin: 1 user (sir.cons@btr.gov.ph)
ncr-users: 1 user (ncr.admin@btr.gov.ph)
region1-users: 1 user (region1.admin@btr.gov.ph)
region2-users: 0 users (ready for assignment)
... (other regions ready)
```

## 🧪 Testing Completed
- ✅ User Pool creation successful
- ✅ All 9 groups created
- ✅ Custom attributes configured
- ✅ Test users created and assigned to groups
- ✅ Client configuration ready for web app

## 📝 User Onboarding Process

### For Regional Admins
1. Admin creates user with regional attributes
2. User receives temporary password
3. User logs in and changes password
4. User automatically directed to their regional folder
5. User can upload/download documents in their region only

### For Sir Cons (Super Admin)
1. Logs in with super-admin credentials
2. Sees unified dashboard with all regions
3. Can filter/search across all regions
4. Has full access to all documents

## 🔧 Commands Used

### Create User Pool
```bash
aws cognito-idp create-user-pool \
  --pool-name "BTR-Treasury-UserPool" \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema '[{"Name": "region", "AttributeDataType": "String", "Required": false, "Mutable": true}]'
```

### Create User Groups
```bash
aws cognito-idp create-group \
  --group-name "ncr-users" \
  --user-pool-id "ap-southeast-1_AkRq0F7rd" \
  --description "NCR Region Treasury Users"
```

### Create Users
```bash
aws cognito-idp admin-create-user \
  --user-pool-id "ap-southeast-1_AkRq0F7rd" \
  --username "sir.cons@btr.gov.ph" \
  --user-attributes Name=email,Value="sir.cons@btr.gov.ph" Name="custom:region",Value="ALL" Name="custom:role",Value="super-admin"
```

## 📈 Scalability Notes
- **Additional Regions**: Easy to add new groups and users
- **User Limit**: Cognito supports 40M+ users
- **Group Limit**: 10,000 groups per user pool
- **Custom Attributes**: Can add more as needed

## 🔧 Maintenance Tasks
- **Regular**: Monitor failed login attempts
- **Monthly**: Review user access and remove inactive users
- **Quarterly**: Audit group memberships
- **Annually**: Review password policies and security settings

## 📝 Next Steps
1. **Phase 3**: IAM Roles & Policies (NEXT)
2. Connect Cognito groups to S3 folder permissions
3. Test regional access controls
4. Implement web app authentication

---
**Created by**: AWS Solutions Architecture Team  
**For**: Bureau of Treasury Document Management System  
**Contact**: Technical Support Team
