import { PageHeader } from "@ant-design/pro-layout";
import { type ApolloError } from "@apollo/client";
import {
  ErrorAlert,
  P,
  useOrganizationLoading,
  useOrganizationSlug,
} from "@app/components";
import {
  type OrganizationPage_OrganizationFragment,
  type SharedLayout_UserFragment,
  useDeleteOrganizationMutation,
  useOrganizationPageQuery,
} from "@app/graphql";
import { Alert, Button, message, Popconfirm } from "antd";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import React, { type FC, useCallback, useState } from "react";

import { OrganizationSettingsLayout } from "../../../../layouts/OrganizationSettingsLayout";
import { AuthRestrict, SharedLayout } from "../../../../layouts/SharedLayout";

const OrganizationSettingsPage: NextPage = () => {
  const slug = useOrganizationSlug();
  const query = useOrganizationPageQuery({ variables: { slug } });
  const organizationLoadingElement = useOrganizationLoading(query);
  const organization = query?.data?.organizationBySlug;

  return (
    <SharedLayout
      title={organization?.name ?? slug}
      titleHref={`/o/[slug]`}
      titleHrefAs={`/o/${slug}`}
      noPad
      query={query}
      forbidWhen={AuthRestrict.LOGGED_OUT}
    >
      {({ currentUser }) =>
        organizationLoadingElement || (
          <OrganizationSettingsPageInner
            organization={organization!}
            currentUser={currentUser}
          />
        )
      }
    </SharedLayout>
  );
};

interface OrganizationSettingsPageInnerProps {
  currentUser?: SharedLayout_UserFragment | null;
  organization: OrganizationPage_OrganizationFragment;
}

const OrganizationSettingsPageInner: FC<OrganizationSettingsPageInnerProps> = (
  props
) => {
  const { organization } = props;
  const router = useRouter();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [error, setError] = useState<ApolloError | null>(null);
  const handleDelete = useCallback(async () => {
    try {
      await deleteOrganization({
        variables: {
          organizationId: organization.id,
        },
        refetchQueries: ["SharedLayout"],
      });
      message.info(`Organization '${organization.name}' successfully deleted`);
      router.push("/");
    } catch (e: any) {
      setError(e);
      return;
    }
  }, [deleteOrganization, organization.id, organization.name, router]);
  return (
    <OrganizationSettingsLayout organization={organization} href={router.route}>
      <div>
        <PageHeader title="Delete Organization?" />
        {organization.currentUserIsOwner ? (
          <Alert
            type="error"
            message={`Really delete '${organization.name}'`}
            description={
              <div>
                <P>This action cannot be undone, be very careful.</P>
                <Popconfirm
                  title={`Are you sure you want to delete ${organization.name}?`}
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Delete this organization</Button>
                </Popconfirm>
              </div>
            }
          />
        ) : (
          <Alert
            type="warning"
            message="You are not permitted to do this"
            description="Only the owner may delete the organization. If you cannot reach the owner, please get in touch with support."
          />
        )}
        {error ? <ErrorAlert error={error} /> : null}
      </div>
    </OrganizationSettingsLayout>
  );
};
export default OrganizationSettingsPage;
