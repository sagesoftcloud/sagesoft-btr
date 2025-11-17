# BTR User Management Guide 👥

## 📋 Overview
**Document**: BTR User Management & Administration Guide  
**System**: Bureau of Treasury Document Management System  
**Version**: 1.0  
**Date**: November 17, 2025  
**Status**: ✅ OPERATIONAL  

## 🎯 User Management Objectives
- ✅ Create and manage BTR system users
- ✅ Assign regional access permissions
- ✅ Configure super admin and regional admin roles
- ✅ Maintain security and access controls
- ✅ Support user onboarding and offboarding

---

## 🔧 **Adding New Users to BTR System**

### **Prerequisites**
- AWS CLI configured with BTR account (367471965495)
- Access to Cognito User Pool: `ap-southeast-1_AkRq0F7rd`
- Admin permissions in BTR system

### **Step 1: Configure AWS Profile**
```bash
# Set up BTR account profile
aws configure set aws_access_key_id AKIAVLDYJGU3XMG6N3LU --profile btr
aws configure set aws_secret_access_key [SECRET_KEY] --profile btr
aws configure set region ap-southeast-1 --profile btr

# Verify correct account
aws sts get-caller-identity --profile btr
# Should show Account: 367471965495
```

### **Step 2: Create Super Admin User**
```bash
# Create super admin (like Sir Cons)
aws cognito-idp admin-create-user \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username "user.email@btr.gov.ph" \
  --user-attributes \
    Name=email,Value="user.email@btr.gov.ph" \
    Name="custom:region",Value="ALL" \
    Name="custom:role",Value="super-admin" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS \
  --profile btr

# Add to super-admin group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME_FROM_RESPONSE] \
  --group-name super-admin \
  --profile btr
```

### **Step 3: Create Regional Admin User**
```bash
# Create regional admin (specify region)
aws cognito-idp admin-create-user \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username "regional.admin@btr.gov.ph" \
  --user-attributes \
    Name=email,Value="regional.admin@btr.gov.ph" \
    Name="custom:region",Value="NCR" \
    Name="custom:role",Value="admin" \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS \
  --profile btr

# Add to regional group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME_FROM_RESPONSE] \
  --group-name ncr-users \
  --profile btr
```

---

## 👥 **User Types & Permissions**

### **Super Administrator**
**Role**: `super-admin`  
**Region**: `ALL`  
**Group**: `super-admin`  

**Permissions**:
- ✅ Access all 15 regional folders
- ✅ Cross-regional document search
- ✅ Full AI assistant access
- ✅ Unified dashboard with region filter
- ✅ System administration capabilities

**Use Cases**:
- Bureau of Treasury leadership (Sir Cons level)
- System administrators
- Cross-regional oversight roles

### **Regional Administrator**
**Role**: `admin`  
**Region**: Specific region (NCR, REGION-1, etc.)  
**Group**: Regional group (ncr-users, region1-users, etc.)  

**Permissions**:
- ✅ Access assigned regional folder only
- ✅ Upload/download regional documents
- ✅ AI assistant with regional context
- ✅ Regional dashboard view
- ❌ Cannot access other regions

**Use Cases**:
- Regional treasury offices
- Local administrators
- Regional document managers

---

## 🏗️ **Available Regional Groups**

| Region | Group Name | Folder Access | Description |
|--------|------------|---------------|-------------|
| **NCR** | ncr-users | NCR/ | National Capital Region |
| **REGION-1** | region1-users | REGION-1/ | Ilocos Region |
| **REGION-2** | region2-users | REGION-2/ | Cagayan Valley |
| **REGION-3** | region3-users | REGION-3/ | Central Luzon |
| **REGION-4A** | region4a-users | REGION-4A/ | CALABARZON |
| **REGION-4B** | region4b-users | REGION-4B/ | MIMAROPA |
| **REGION-5** | region5-users | REGION-5/ | Bicol Region |
| **REGION-6** | region6-users | REGION-6/ | Western Visayas |
| **REGION-7** | region7-users | REGION-7/ | Central Visayas |
| **REGION-8** | region8-users | REGION-8/ | Eastern Visayas |
| **REGION-9** | region9-users | REGION-9/ | Zamboanga Peninsula |
| **REGION-10** | region10-users | REGION-10/ | Northern Mindanao |
| **REGION-11** | region11-users | REGION-11/ | Davao Region |
| **REGION-12** | region12-users | REGION-12/ | SOCCSKSARGEN |
| **REGION-13** | region13-users | REGION-13/ | Caraga |

---

## 🔑 **Current Active Users**

### **Super Administrators**
| Name | Email | Status | Created | Access |
|------|-------|--------|---------|---------|
| **Sir Cons** | sir.cons@btr.gov.ph | ✅ Active | Nov 17, 2025 | ALL Regions |
| **Jimmel Bermudez** | jimmel.bermudez@sagesoftcloud.com | ✅ Active | Nov 17, 2025 | ALL Regions |

### **Regional Administrators**
| Name | Email | Region | Status | Created |
|------|-------|--------|--------|---------|
| **NCR Admin** | ncr.admin@btr.gov.ph | NCR | ✅ Active | Nov 17, 2025 |
| **Region 1 Admin** | region1.admin@btr.gov.ph | REGION-1 | ✅ Active | Nov 17, 2025 |
| **Jimmel Personal** | bermudezjimmel7@gmail.com | NCR | ✅ Active | Nov 17, 2025 |

---

## 🔧 **User Management Commands**

### **List All Users**
```bash
aws cognito-idp list-users \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --profile btr
```

### **Get User Details**
```bash
aws cognito-idp admin-get-user \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username "user.email@btr.gov.ph" \
  --profile btr
```

### **Update User Attributes**
```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME] \
  --user-attributes \
    Name="custom:region",Value="REGION-2" \
    Name="custom:role",Value="admin" \
  --profile btr
```

### **Reset User Password**
```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME] \
  --password "NewTempPass123!" \
  --temporary \
  --profile btr
```

### **Disable User**
```bash
aws cognito-idp admin-disable-user \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME] \
  --profile btr
```

### **Delete User**
```bash
aws cognito-idp admin-delete-user \
  --user-pool-id ap-southeast-1_AkRq0F7rd \
  --username [USERNAME] \
  --profile btr
```

---

## 🧪 **Testing New Users**

### **Step 1: Verify User Creation**
1. **Check User Pool**: Confirm user appears in Cognito console
2. **Verify Attributes**: Ensure custom:region and custom:role are set
3. **Group Membership**: Confirm user is in correct group

### **Step 2: Test Login**
1. **Visit**: https://bermudezjimmel.github.io/sagesoft-btr-webapp/
2. **Login**: Use new user credentials
3. **Password Change**: Complete forced password change
4. **Dashboard**: Verify correct regional context appears

### **Step 3: Test Permissions**
1. **Regional Access**: Confirm user sees only assigned region
2. **Document Operations**: Test upload/download in regional folder
3. **AI Assistant**: Verify AI responds with regional context
4. **Cross-Region**: Confirm user cannot access other regions

---

## 🔐 **Security Best Practices**

### **Password Management**
- ✅ Use strong temporary passwords
- ✅ Force password change on first login
- ✅ Implement password complexity requirements
- ✅ Regular password rotation policies

### **Access Control**
- ✅ Assign minimum required permissions
- ✅ Regular access reviews and audits
- ✅ Immediate revocation for terminated users
- ✅ Monitor unusual access patterns

### **User Lifecycle**
- ✅ Proper onboarding with training
- ✅ Regular permission reviews
- ✅ Secure offboarding process
- ✅ Account deactivation procedures

---

## 📊 **User Management Dashboard**

### **Quick Stats**
- **Total Users**: 5 active users
- **Super Admins**: 2 users
- **Regional Admins**: 3 users
- **Regions Covered**: NCR, REGION-1
- **Available Regions**: 13 additional regions ready

### **System Health**
- **Authentication**: ✅ Working (no SECRET_HASH errors)
- **Regional Access**: ✅ Enforced via IAM roles
- **AI Integration**: ✅ Context-aware responses
- **Document Management**: ✅ S3 integration functional

---

## 🆘 **Troubleshooting User Issues**

### **Login Problems**
**Issue**: User cannot login  
**Solutions**:
1. Check user status (not disabled)
2. Verify password hasn't expired
3. Confirm user pool client configuration
4. Check for account lockouts

### **Permission Errors**
**Issue**: User cannot access documents  
**Solutions**:
1. Verify custom:region attribute
2. Check group membership
3. Confirm IAM role mapping
4. Test with different user

### **Regional Access Issues**
**Issue**: User sees wrong region or no access  
**Solutions**:
1. Update custom:region attribute
2. Move user to correct group
3. Clear browser cache
4. Re-login to refresh tokens

---

## 📋 **User Onboarding Checklist**

### **For New Super Admin**
- [ ] Create user with super-admin role
- [ ] Add to super-admin group
- [ ] Test login and password change
- [ ] Verify access to all regions
- [ ] Test AI assistant functionality
- [ ] Provide system training

### **For New Regional Admin**
- [ ] Create user with admin role
- [ ] Set correct custom:region attribute
- [ ] Add to appropriate regional group
- [ ] Test login and password change
- [ ] Verify regional folder access only
- [ ] Test document upload/download
- [ ] Provide regional training

---

## 📞 **Support Information**

### **Technical Support**
- **System Administrator**: BTR IT Department
- **AWS Account**: 367471965495
- **User Pool**: ap-southeast-1_AkRq0F7rd
- **Documentation**: BTR Implementation Dashboard

### **Emergency Procedures**
- **Account Lockout**: Contact system administrator
- **Password Reset**: Use admin-set-user-password command
- **Access Issues**: Verify group membership and attributes
- **System Down**: Check BTR Implementation Dashboard

---

**Created by**: AWS Solutions Architecture Team  
**For**: Bureau of Treasury Document Management System  
**Last Updated**: November 17, 2025  
**Status**: Production Ready 🚀
