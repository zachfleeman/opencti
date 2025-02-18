import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import RegionEdition from './RegionEdition';
import RegionPopover from './RegionPopover';
import StixCoreObjectOrStixCoreRelationshipLastReports from '../../analysis/reports/StixCoreObjectOrStixCoreRelationshipLastReports';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';
import Security from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import StixCoreObjectOrStixCoreRelationshipNotes from '../../analysis/notes/StixCoreObjectOrStixCoreRelationshipNotes';
import StixDomainObjectOverview from '../../common/stix_domain_objects/StixDomainObjectOverview';
import StixCoreObjectExternalReferences from '../../analysis/external_references/StixCoreObjectExternalReferences';
import StixCoreObjectLatestHistory from '../../common/stix_core_objects/StixCoreObjectLatestHistory';
import SimpleStixObjectOrStixRelationshipStixCoreRelationships from '../../common/stix_core_relationships/SimpleStixObjectOrStixRelationshipStixCoreRelationships';
import LocationMiniMap from '../../common/location/LocationMiniMap';
import { Region_region$key } from './__generated__/Region_region.graphql';

const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
}));

const regionFragment = graphql`
  fragment Region_region on Region {
    id
    standard_id
    x_opencti_stix_ids
    spec_version
    revoked
    confidence
    created
    modified
    created_at
    updated_at
    createdBy {
      ... on Identity {
        id
        name
        entity_type
      }
    }
    creator {
      id
      name
    }
    objectMarking {
      edges {
        node {
          id
          definition
          x_opencti_color
        }
      }
    }
    objectLabel {
      edges {
        node {
          id
          value
          color
        }
      }
    }
    countries {
      edges {
        node {
          name
          x_opencti_aliases
        }
      }
    }
    name
    latitude
    longitude
    x_opencti_aliases
    isSubRegion
    status {
      id
      order
      template {
        name
        color
      }
    }
    workflowEnabled
  }
`;

const RegionComponent = ({ regionData }: { regionData: Region_region$key }) => {
  const classes = useStyles();
  const region = useFragment<Region_region$key>(regionFragment, regionData);
  const countries = region.countries?.edges.map(
    (countryEdge) => countryEdge.node,
  );
  return (
    <div className={classes.container}>
      <StixDomainObjectHeader
        disableSharing={true}
        stixDomainObject={region}
        isOpenctiAlias={true}
        PopoverComponent={<RegionPopover id={region.id} />}
      />
      <Grid
        container={true}
        spacing={3}
        classes={{ container: classes.gridContainer }}
      >
        <Grid item={true} xs={6} style={{ paddingTop: 10 }}>
          <LocationMiniMap
            center={
              region.latitude && region.longitude
                ? [region.latitude, region.longitude]
                : [48.8566969, 2.3514616]
            }
            countries={countries}
            zoom={region.isSubRegion ? 4 : 3}
          />
        </Grid>
        <Grid item={true} xs={6} style={{ paddingTop: 10 }}>
          <StixDomainObjectOverview stixDomainObject={region} />
        </Grid>
      </Grid>
      <Grid
        container={true}
        spacing={3}
        classes={{ container: classes.gridContainer }}
        style={{ marginTop: 25 }}
      >
        <Grid item={true} xs={6}>
          <SimpleStixObjectOrStixRelationshipStixCoreRelationships
            stixObjectOrStixRelationshipId={region.id}
            stixObjectOrStixRelationshipLink={`/dashboard/locations/regions/${region.id}/knowledge`}
          />
        </Grid>
        <Grid item={true} xs={6}>
          <StixCoreObjectOrStixCoreRelationshipLastReports
            stixCoreObjectOrStixCoreRelationshipId={region.id}
          />
        </Grid>
      </Grid>
      <Grid
        container={true}
        spacing={3}
        classes={{ container: classes.gridContainer }}
        style={{ marginTop: 25 }}
      >
        <Grid item={true} xs={6}>
          <StixCoreObjectExternalReferences stixCoreObjectId={region.id} />
        </Grid>
        <Grid item={true} xs={6}>
          <StixCoreObjectLatestHistory stixCoreObjectId={region.id} />
        </Grid>
      </Grid>
      <StixCoreObjectOrStixCoreRelationshipNotes
        stixCoreObjectOrStixCoreRelationshipId={region.id}
        defaultMarking={(region.objectMarking?.edges ?? []).map((edge) => edge.node)}
      />
      <Security needs={[KNOWLEDGE_KNUPDATE]}>
        <RegionEdition regionId={region.id} />
      </Security>
    </div>
  );
};

export default RegionComponent;
